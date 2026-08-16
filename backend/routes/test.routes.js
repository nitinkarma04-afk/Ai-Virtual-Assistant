import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Virtual Assistant Backend is working 🚀"
    });
});

export default router;