import express from "express";
import { listTopics } from "../controllers/topic.controller.js";

const router = express.Router();

router.get("/", listTopics);

export default router;
