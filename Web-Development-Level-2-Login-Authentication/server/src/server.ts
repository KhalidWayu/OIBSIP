import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Main route
app.get("/", (_req, res) => {
  res.json({
    message: "Login Authentication API is running!",
  });
});

// Database health check
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

// Authentication routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});