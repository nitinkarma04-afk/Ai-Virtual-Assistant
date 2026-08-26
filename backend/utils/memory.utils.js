import Memory from "../models/memory.model.js";


// Get all memories of a user
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


// Format memories before sending them to AI
export const formatMemoriesForAI = (memories) => {
    if (!memories || memories.length === 0) {
        return "No relevant saved memories about the user.";
    }

    return memories
        .map((memory) => `${memory.key}: ${memory.value}`)
        .join("\n");
};


// Get memories relevant to the current user message
export const getRelevantMemories = (memories, message) => {
    if (!memories || memories.length === 0) {
        return [];
    }

    if (!message || !message.trim()) {
        return [];
    }

    const userMessage = message.toLowerCase();

    return memories.filter((memory) => {
        const key = memory.key.toLowerCase();
        const value = memory.value.toLowerCase();

        // Direct match
        if (
            userMessage.includes(key) ||
            userMessage.includes(value)
        ) {
            return true;
        }

        // Split memory key into individual words
        const keyWords = key.split("_");

        // Check if important keywords exist in user message
        const matchedWords = keyWords.filter((word) =>
            userMessage.includes(word)
        );

        // At least 2 key words should match
        return matchedWords.length >= 2;
    });
};

// Normalize memory keys
export const normalizeMemoryKey = (key) => {

    if (!key) {
        return "";
    }

    return key
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_");
};