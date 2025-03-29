require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");

const app = express();
app.use(express.json());

// Define allowed origins
const allowedOrigins = ["http://localhost:3000", "https://omnifood-meal-available.netlify.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
})); // Allow frontend requests

app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Create Schema & Model
const clickSchema = new mongoose.Schema({
  buttonName: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true }, // Index for aggregation
  clickCount: { type: Number, default: 1 }
}, { timestamps: true });

const Click = mongoose.model("Click", clickSchema);

let bulkOps = []; // Bulk write cache

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

// API to Track Clicks
app.post("/track-click", async (req, res, next) => {
  const { buttonName } = req.body;
  if (!buttonName) return res.status(400).json({ error: "Button name is required!" });

  // Add to bulk operations
  bulkOps.push({
    updateOne: {
      filter: { buttonName },  // Match by button name
      update: { $inc: { clickCount: 1 }, $setOnInsert: { timestamp: new Date() } },  // Increment and set timestamp if inserted
      upsert: true
    }
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
    const groupByFormat = interval === "hourly" ? "%Y-%m-%d %H:00" : "%Y-%m-%d";

    const aggregation = await Click.aggregate([
      {
        $group: {
          _id: {
            buttonName: "$buttonName",
            date: { $dateToString: { format: groupByFormat, date: "$timestamp" } }
          },
          totalClicks: { $sum: "$clickCount" }
        }
      },
      {
        $merge: {
          into: "aggregatedclicks",
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]);

    console.log(`✅ ${interval} aggregation completed`, aggregation);
  } catch (error) {
    console.error(`❌ Aggregation error (${interval}):`, error);
  }
}

cron.schedule("0 * * * *", () => aggregateClicks("hourly"));   // Every hour
cron.schedule("0 0 * * *", () => aggregateClicks("daily"));    // Every day at midnight

// Periodic flush every 10 seconds
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
}, 60000); // Runs every 60 seconds

// Flush remaining clicks before shutdown
async function flushBeforeExit() {
  if (bulkOps.length > 0) {
    try {
      await Click.bulkWrite(bulkOps);
      console.log(`✅ Final flush executed with ${bulkOps.length} operations before exit`);
    } catch (error) {
      console.error("❌ Final flush error:", error);
    }
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🚨 SIGINT received. Flushing remaining clicks...");
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
