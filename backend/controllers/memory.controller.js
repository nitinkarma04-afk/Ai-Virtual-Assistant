import Memory from "../models/memory.model.js";
import { normalizeMemoryKey, isSensitiveInfo } from "../utils/memory.utils.js";

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

        // Check for sensitive credentials
        if (isSensitiveInfo(key) || isSensitiveInfo(value)) {
            return res.status(400).json({
                success: false,
                message: "Sensitive information like passwords and tokens cannot be saved in memory",
            });
        }

        const normalizedKey = normalizeMemoryKey(key);
        const normalizedValue = value.trim();

        if (!normalizedKey || !normalizedValue) {
            return res.status(400).json({
                success: false,
                message: "Invalid memory key or value",
            });
        }

        // Create or update memory scoped to authenticated user
        const memory = await Memory.findOneAndUpdate(
            {
                userId: req.userId,
                key: normalizedKey,
            },
            {
                userId: req.userId,
                key: normalizedKey,
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
        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Memory key is required",
            });
        }

        const decodedKey = decodeURIComponent(key);
        const normalizedKey = normalizeMemoryKey(decodedKey);

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