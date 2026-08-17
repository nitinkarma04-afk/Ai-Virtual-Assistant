import express from "express";

import {
    saveConversation,
    getConversationHistory,
    deleteConversationHistory,
} from "../controllers/conversation.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/save",
    authMiddleware,
    saveConversation
);

router.get(
    "/history",
    authMiddleware,
    getConversationHistory
);

router.delete(
    "/history",
    authMiddleware,
    deleteConversationHistory
);

export default router;