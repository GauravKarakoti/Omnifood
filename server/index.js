const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./middlewares/passport.js');
const path = require('path');

const { errorMiddleware } = require('./middlewares/error.js');
const authRouter = require('./routes/user.js');
const csurf = require('csurf');

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "../public/login/login.html")));

// Connect to the database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // Limit each IP to 100 requests per windowMs
    message: "⚠️ Too many requests, please try again later.",
    standardHeaders: true,      // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false        // Disable the `X-RateLimit-*` headers
});

// handle cors policy
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', limiter);

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure:false,
        sameSite: "Strict"
    }
})
app.use(csrfProtection);

// app.get('/',(req, res) => {
//     res.send("<a href='/auth/google'>Authenticate me</a>");
// })

app.get('/auth/google',passport.authenticate('google', {
    scope: ['profile', 'email']
}))

app.get('/google/callback',
    passport.authenticate("google", { 
        successRedirect:'/api/success',
        failureRedirect: "/auth/failure" }),
)

app.get('/auth/linkedin', passport.authenticate('linkedin'),
);

app.get('/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/api/success',
    failureRedirect: '/auth/failure'
}))


app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/api/success',
        failureRedirect:'/auth/failure'
    })
)

app.get('/auth/facebook',
    passport.authenticate('facebook')
);

app.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/api/success',
        failureRedirect: '/auth/failure'
    }),
)

app.get('/auth/failure', (req, res) => {
    res.redirect('http://127.0.0.1:5500/public/login/login.html');
})

app.get('/api/success' , (req,res) => {
    res.redirect('http://127.0.0.1:5500/public/profile.html');
})

// CSRF Route 
app.get('/api/csrf-token' , (req, res)=>{
    if(!req.csrfToken) return res.status(500).json({message: 'CSRF Token not generated'});
    res.status(200).json({csrfToken: req.csrfToken() });
});

// auth routes
app.use('/api/auth', authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Error middleware
app.use(errorMiddleware);