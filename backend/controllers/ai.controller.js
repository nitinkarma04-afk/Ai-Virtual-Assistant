import callAI from "../services/ai.service.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const response = await callAI(message.trim());

        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            response,
        });

    } catch (error) {
        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
        });
    }
};