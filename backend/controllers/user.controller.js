import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, assistantImage } = req.body;

        if (!assistantName && !assistantImage) {
            return res.status(400).json({
                success: false,
                message: "Please provide assistant name or image",
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (assistantName) {
            user.assistantName = assistantName;
        }

        if (assistantImage) {
            user.assistantImage = assistantImage;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Assistant updated successfully",
            assistant: {
                name: user.assistantName,
                image: user.assistantImage,
            },
        });
    } catch (error) {
        console.error("Update assistant error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};