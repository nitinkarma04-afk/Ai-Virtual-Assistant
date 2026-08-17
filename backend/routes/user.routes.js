import express from "express";
import {
    getCurrentUser,
    updateAssistant,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

router.put("/assistant", authMiddleware, updateAssistant);

export default router;