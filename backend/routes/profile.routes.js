import express from "express";

import {
    getUserProfile,
    createUserProfile,
    updateUserProfile
} from "../controllers/profile.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();


// GET profile
router.get("/", authMiddleware, getUserProfile);

// CREATE profile
router.post("/", authMiddleware, createUserProfile);

// UPDATE profile
router.put("/", authMiddleware, updateUserProfile);


export default router;