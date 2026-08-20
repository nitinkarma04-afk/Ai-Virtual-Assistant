import Memory from "../models/memory.model.js";

// =========================
// SAVE / UPDATE MEMORY
// =========================
export const saveMemory = async (req, res) => {
    try {
        const { key, value } = req.body;

// Check required fields
if (!key || !value) {
    return res.status(400).json({
        success: false,
        message: "Key and value are required",
    });
}

const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");
const normalizedValue = value.trim();
        // Create or update memory
        const memory = await Memory.findOneAndUpdate(
            {
                userId: req.userId,
                key: normalizedKey,
            },
            {
                value: normalizedValue,
            },
           {
    returnDocument: "after",
    upsert: true,
}
        );

        return res.status(200).json({
            success: true,
            message: "Memory saved successfully",
            memory,
        });

    } catch (error) {
        console.error("Save memory error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =========================
// GET ALL MEMORIES
// =========================
export const getMemories = async (req, res) => {
    try {
        const memories = await Memory.find({
            userId: req.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            memories,
        });

    } catch (error) {
        console.error("Get memories error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =========================
// DELETE MEMORY
// =========================
export const deleteMemory = async (req, res) => {
    try {
        const { key } = req.params;
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");

        const memory = await Memory.findOneAndDelete({
            userId: req.userId,
            key: normalizedKey,
        });

        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Memory deleted successfully",
        });

    } catch (error) {
        console.error("Delete memory error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};