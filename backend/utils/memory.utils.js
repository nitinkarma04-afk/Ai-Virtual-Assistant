import Memory from "../models/memory.model.js";

export const getUserMemories = async (userId) => {
    try {
        const memories = await Memory.find({
            userId,
        });

        return memories;
    } catch (error) {
        console.error("Get user memories error:", error);
        return [];
    }
};


export const formatMemoriesForAI = (memories) => {
    if (!memories || memories.length === 0) {
        return "No saved memories about the user.";
    }

    return memories
        .map((memory) => `${memory.key}: ${memory.value}`)
        .join("\n");
};