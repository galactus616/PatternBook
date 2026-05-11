import express from "express";
import * as waitlistController from "../controllers/waitlist.controller.js";

const router = express.Router();

router.post("/join", waitlistController.joinWaitlist);

export default router;
