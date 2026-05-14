import express from "express";
import cors from "cors";
import "dotenv/config";

import { prisma } from "./db/client.js";

import problemRoutes from "./routes/problem.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import topicRoutes from "./routes/topic.routes.js";


const app = express();

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
app.use("/v1/topics", topicRoutes);
app.use("/v1/problems", problemRoutes);
app.use("/v1/progress", progressRoutes);
app.use("/v1/dashboard", dashboardRoutes);
app.use("/v1/payments", paymentRoutes);
app.use("/v1/waitlist", waitlistRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await prisma.$connect();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect DB", err);
        process.exit(1);
    }
}

startServer();