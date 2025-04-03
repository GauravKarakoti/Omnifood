// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose')
// const dotenv = require('dotenv');
// const rateLimit = require('express-rate-limit');

// const { errorMiddleware } = require('./middlewares/error.js');
// const authRouter = require('./routes/user.js');
// const csurf = require('csurf');

// dotenv.config();

// const app = express();

// // Connect to the database
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,  // 15 minutes
//     max: 100,                   // Limit each IP to 100 requests per windowMs
//     message: "⚠️ Too many requests, please try again later.",
//     standardHeaders: true,      // Return rate limit info in `RateLimit-*` headers
//     legacyHeaders: false        // Disable the `X-RateLimit-*` headers
// });

// // handle cors policy
// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }))

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use('/api', limiter);

// const csrfProtection = csurf({
//     cookie: {
//         httpOnly: true,
//         secure:false,
//         sameSite: "Strict"
//     }
// })
// app.use(csrfProtection);

// // CSRF Route 
// app.get('/api/csrf-token' , (req, res)=>{
//     if(!req.csrfToken) return res.status(500).json({message: 'CSRF Token not generated'});
//     res.status(200).json({csrfToken: req.csrfToken() });
// });

// // auth routes
// app.use('/api/auth', authRouter);

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

// // Error middleware
// app.use(errorMiddleware);



const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { errorMiddleware } = require('./middlewares/error.js');
const authRouter = require('./routes/user.js');
const csrf = require('csurf');

dotenv.config();

const app = express();

// Connect to the database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "⚠️ Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', limiter);

// CSRF Configuration (not applied globally)
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'Strict'
    }
});

// CSRF Token endpoint (available to all clients)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

// Auth routes - No CSRF protection for API endpoints
app.use('/api/auth', authRouter);

// Apply CSRF only to specific web routes (example)
// app.post('/submit-form', csrfProtection, formController);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Error middleware
app.use(errorMiddleware);