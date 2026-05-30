import "dotenv/config";
import { app, server } from "./socket.js";
import express from "express";
import cors from "cors";

import { prisma } from "./db/client.js";

import problemRoutes from "./routes/problem.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// routes
app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/topics", topicRoutes);
app.use("/v1/problems", problemRoutes);
app.use("/v1/progress", progressRoutes);
app.use("/v1/dashboard", dashboardRoutes);
app.use("/v1/payments", paymentRoutes);
app.use("/v1/waitlist", waitlistRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/friends", friendRoutes);
app.use("/v1/notifications", notificationRoutes);
app.use("/v1/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect DB", err);
    process.exit(1);
  }
}

startServer();