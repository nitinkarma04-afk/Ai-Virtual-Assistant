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
import errorMiddleware from "./middlewares/error.middleware.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
 

// Middleware
app.use(express.json());

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/profile", profileRoutes);

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