import express from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

export default router;