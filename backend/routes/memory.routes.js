import express from "express";

import {
    saveMemory,
    getMemories,
    deleteMemory,
} from "../controllers/memory.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Save / Update memory
router.post("/", authMiddleware, saveMemory);

// Get all memories
router.get("/", authMiddleware, getMemories);

// Delete memory
router.delete("/:key", authMiddleware, deleteMemory);

export default router;