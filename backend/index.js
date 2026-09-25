import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import desktopRoutes from "./routes/desktop.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import crypto from "crypto";
dotenv.config();
 
//just check
 


const app = express();
const port = process.env.PORT || 8000;
 

// Middleware
app.use(express.json());

// add this extra 
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  res.header(
    "Access-Control-Allow-Credentials",
    "true"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/desktop", desktopRoutes);
app.use("/api/conversation/test-db-error", conversationRoutes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Global error handler
app.use(errorMiddleware);
app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
});