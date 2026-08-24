import callAI from "../services/ai.service.js";
import Conversation from "../models/conversation.model.js";
import extractMemories from "../services/memory.service.js";
import Memory from "../models/memory.model.js";
import {
    getUserMemories,
    formatMemoriesForAI,
    normalizeMemoryKey,
} from "../utils/memory.utils.js";
import detectIntent from "../services/intent.service.js";

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

        // 2. Get previous conversations of logged-in user
        // Get user's long-term memories
const memories = await getUserMemories(req.userId);
const memoryContext = formatMemoriesForAI(memories);
  

 
        const previousConversations = await Conversation.find({
            userId: req.userId,
        })
            .sort({ createdAt: -1 })
            .limit(10);

        // 3. Reverse them so oldest conversation comes first
        previousConversations.reverse();

        // 4. Create conversation context
        const conversationContext = previousConversations
            .map((conversation) => {
                return `User: ${conversation.message}
Assistant: ${conversation.response}`;
            })
            .join("\n\n");

        // 5. Send current message + previous context to AI
       const response = await callAI(
    message.trim(),
    conversationContext,
    memoryContext,
    intent
);

        // 6. Save current conversation automatically
        const conversation = await Conversation.create({
            userId: req.userId,
            message: message.trim(),
            response,
        });
// 7. Extract important memories from current message
const extractedMemories = await extractMemories(message.trim());
        // 8. Save extracted memories
        
        for (const memory of extractedMemories) {
    if (!memory.key || !memory.value) {
        continue;
    }

  const normalizedKey = normalizeMemoryKey(memory.key);

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
        // 9. Send response
        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            response,
            conversationId: conversation._id,
        });

    } catch (error) {
        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
        });
    }
};