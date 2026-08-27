import callAI from "../services/ai.service.js";
import Conversation from "../models/conversation.model.js";
import extractMemories from "../services/memory.service.js";
import Memory from "../models/memory.model.js";

import {
    getUserMemories,
    formatMemoriesForAI,
    getRelevantMemories,
    normalizeMemoryKey,
} from "../utils/memory.utils.js";

import detectIntent from "../services/intent.service.js";
import Profile from "../models/profile.model.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Check message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const intent = await detectIntent(message.trim());

        // 2. Get user's long-term memories
        const memories = await getUserMemories(req.userId);

        // 3. Get user's profile
        const profile = await Profile.findOne({
            userId: req.userId,
        });

        // 4. Create profile context for AI
        const profileContext = profile
            ? `
Bio: ${profile.bio || ""}
Role: ${profile.role || ""}
Skills: ${profile.skills?.join(", ") || ""}
Interests: ${profile.interests?.join(", ") || ""}
Location: ${profile.location || ""}
`
            : "";

        // 5. Get relevant memories
        const relevantMemories = getRelevantMemories(
            memories,
            message.trim()
        );

        const memoryContext = formatMemoriesForAI(
            relevantMemories
        );

        // 6. Get previous conversations
        const previousConversations = await Conversation.find({
            userId: req.userId,
        })
            .sort({ createdAt: -1 })
            .limit(10);

        // 7. Reverse them so oldest conversation comes first
        previousConversations.reverse();

        // 8. Create conversation context
        const conversationContext = previousConversations
            .map((conversation) => {
                return `User: ${conversation.message}
Assistant: ${conversation.response}`;
            })
            .join("\n\n");

        // 9. Send current message + all context to AI
        const response = await callAI(
            message.trim(),
            conversationContext,
            memoryContext,
            intent,
            profileContext
        );

        // 10. Save current conversation automatically
        const conversation = await Conversation.create({
            userId: req.userId,
            message: message.trim(),
            response,
        });

        // 11. Extract important memories from current message
        const extractedMemories = await extractMemories(
            message.trim()
        );

        // 12. Save extracted memories
        for (const memory of extractedMemories) {

            if (!memory.key || !memory.value) {
                continue;
            }

            const normalizedKey = normalizeMemoryKey(
                memory.key
            );

            const normalizedValue = memory.value.trim();

            await Memory.findOneAndUpdate(
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
                    upsert: true,
                    returnDocument: "after",
                }
            );
        }

        // 13. Send response
        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            response,
            conversationId: conversation._id,
        });

    } catch (error) {

        console.error(
            "AI Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
        });
    }
};