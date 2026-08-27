import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMessage from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
    "/chat",
    authMiddleware,
    validateMessage,
    chatWithAI
);

export default router;