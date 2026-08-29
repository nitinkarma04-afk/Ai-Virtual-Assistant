import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post(
    "/chat",
    authMiddleware,
    asyncHandler(chatWithAI)
);

 

export default router;