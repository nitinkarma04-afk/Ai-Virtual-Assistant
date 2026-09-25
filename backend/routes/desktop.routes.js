import express from "express";
import { executeDesktopAction } from "../controllers/desktop.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post(
  "/execute",
  authMiddleware,
  asyncHandler(executeDesktopAction)

);

export default router;