const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./middlewares/passport.js');
const path = require('path');

const cron = require("node-cron");
const csurf = require("csurf");

const { errorMiddleware } = require("./middlewares/error.js");
const authRouter = require("./routes/user.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = ["http://localhost:3000", "https://omnifood-meal-available.netlify.app", 'http://127.0.0.1:5501'];

app.use(express.static(path.join(__dirname, "../public/login/login.html")));

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⚠️ Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
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
app.use("/api", limiter);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.static(path.join(__dirname.replace("server", ""), "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname.replace("server", ""), "public", "index.html"));
})

// CSRF Protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  },
});
app.use(csrfProtection);



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

app.get("/api/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// Auth routes
app.use("/api/auth", authRouter);

// Click tracking schema
const clickSchema = new mongoose.Schema({
  buttonName: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  clickCount: { type: Number, default: 1 },
}, { timestamps: true });

const Click = mongoose.model("Click", clickSchema);
let bulkOps = [];

// Click tracking API
app.post("/track-click", async (req, res) => {
  const { buttonName } = req.body;
  if (!buttonName) return res.status(400).json({ error: "Button name is required!" });

  bulkOps.push({
    updateOne: {
      filter: { buttonName },
      update: { $inc: { clickCount: 1 }, $setOnInsert: { timestamp: new Date() } },
      upsert: true,
    },
  });

  if (bulkOps.length >= 100) {
    try {
      await Click.bulkWrite(bulkOps);
      console.log(`✅ Bulk write executed with ${bulkOps.length} operations`);
      bulkOps = [];
    } catch (error) {
      console.error("❌ Bulk write error:", error);
    }
  }
  res.json({ success: true, message: "Click recorded!" });
});

// Aggregation logic
async function aggregateClicks(interval) {
  try {
    const format = interval === "hourly" ? "%Y-%m-%d %H:00" : "%Y-%m-%d";
    const aggregation = await Click.aggregate([
      {
        $group: {
          _id: { buttonName: "$buttonName", date: { $dateToString: { format, date: "$timestamp" } } },
          totalClicks: { $sum: "$clickCount" },
        },
      },
      { $merge: { into: "aggregatedclicks", whenMatched: "merge", whenNotMatched: "insert" } },
    ]);
    console.log(`✅ ${interval} aggregation completed`, aggregation);
  } catch (error) {
    console.error(`❌ Aggregation error (${interval}):`, error);
  }
}

cron.schedule("0 * * * *", () => aggregateClicks("hourly"));
cron.schedule("0 0 * * *", () => aggregateClicks("daily"));

// Periodic bulk write flush
setInterval(async () => {
  if (bulkOps.length > 0) {
    try {
      await Click.bulkWrite(bulkOps);
      console.log(`✅ Periodic flush executed with ${bulkOps.length} operations`);
      bulkOps = [];
    } catch (error) {
      console.error("❌ Periodic flush error:", error);
    }
  }
}, 60000);

// Graceful shutdown
async function flushBeforeExit() {
  if (bulkOps.length > 0) {
    try {
      await Click.bulkWrite(bulkOps);
      console.log("✅ Final flush executed before exit");
    } catch (error) {
      console.error("❌ Final flush error:", error);
    }
  }
}
process.on("SIGINT", async () => {
  console.log("\n🚨 SIGTERM received. Flushing remaining clicks...");
  await flushBeforeExit();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  console.log("\n🚨 SIGTERM received. Flushing remaining clicks...");
  await flushBeforeExit();
  process.exit(0);
});
process.on("exit", async () => {
  console.log("\n🔄 Process exiting. Flushing remaining clicks...");
  await flushBeforeExit();
});

// Error handling middleware
app.use(errorMiddleware);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/email-verification", (req, res) => {
  const { status, message } = req.query;

  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            background-color: ${status === 'error' ? '#f8d7da' : '#d4edda'};
            color: ${status === 'error' ? '#721c24' : '#155724'};
          }
          .redirect {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Email Verification Status</h1>
        <div class="message">${message}</div>
        <div class="redirect">
          <p>You will be redirected to the homepage shortly...</p>
        </div>
  
        <script>
          // Redirect to the homepage after 5 seconds
          setTimeout(() => {
            window.location.href = '/';
          }, 5000);
        </script>
      </body>
      </html>
    `);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
