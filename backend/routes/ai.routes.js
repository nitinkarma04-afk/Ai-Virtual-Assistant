import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatWithAI);

export default router;