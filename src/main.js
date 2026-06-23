import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectMongoDB from "#@/databases/connect-mongo.js";
import router from "#@/routes/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Load environment variables
dotenv.config();

// CORS middleware
app.use(cors());

// Parse JSON bodies (like request.body)
app.use(express.json());

// Parse URL-encoded bodies (like form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static("public"));

// Custom middleware
app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Load Routes
app.use("/", router);

//404 error
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "Endpoint not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.name || "Server Error",
    message: err.message || "Something went wrong!",
  });
});

async function startServer() {
  try {
    await connectMongoDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Handle graceful shutdown on CTRL+C
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      server.close(() => {
        console.log("✅ Server closed successfully");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
