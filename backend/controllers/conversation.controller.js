import Conversation from "../models/conversation.model.js";

// Save conversation
export const saveConversation = async (req, res) => {
    try {
        const { message, response } = req.body;

        if (!message || !response) {
            return res.status(400).json({
                success: false,
                message: "Message and response are required",
            });
        }

        const conversation = await Conversation.create({
            userId: req.userId,
            message,
            response,
        });

        return res.status(201).json({
            success: true,
            message: "Conversation saved successfully",
            conversation,
        });
    } catch (error) {
        console.error("Save conversation error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Get conversation history
export const getConversationHistory = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            userId: req.userId,
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            conversations,
        });
    } catch (error) {
        console.error("Get conversation history error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Delete conversation history
export const deleteConversationHistory = async (req, res) => {
    try {
        await Conversation.deleteMany({
            userId: req.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Conversation history deleted successfully",
        });
    } catch (error) {
        console.error("Delete conversation history error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};