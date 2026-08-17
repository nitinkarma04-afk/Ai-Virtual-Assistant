import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

export default router;