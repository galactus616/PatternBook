import express from "express";
import cors from "cors";
import "dotenv/config";

import problemRoutes from "./routes/problem.routes.js";
import progressRoutes from "./routes/progress.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/v1/problems", problemRoutes);
app.use("/v1/progress", progressRoutes);


app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});