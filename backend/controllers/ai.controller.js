import callAI from "../services/ai.service.js";
import Conversation from "../models/conversation.model.js";
import extractMemories from "../services/memory.service.js";
import Memory from "../models/memory.model.js";
import Profile from "../models/profile.model.js";
import detectIntent from "../services/intent.service.js";

import {
    getUserMemories,
    formatMemoriesForAI,
    getRelevantMemories,
    normalizeMemoryKey,
    formatMemoryLabel,
    detectMemoryCommand,
} from "../utils/memory.utils.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Check message validity
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const trimmedMessage = message.trim();

        // 2. Retrieve all saved memories for the authenticated user
        const memories = await getUserMemories(req.userId);

        // 3. Deterministic Memory Command Check
        const memoryCmd = detectMemoryCommand(trimmedMessage, memories);

        if (memoryCmd.isMemoryCommand) {
            // Case 3A: Sensitive credential rejection
            if (memoryCmd.action === "SENSITIVE_REJECT") {
                const reply =
                    memoryCmd.reply ||
                    "⚠️ For your security, I cannot store passwords, API keys, tokens, or sensitive credentials in memory.";

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Sensitive credential rejected",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3B: List all memories
            if (memoryCmd.action === "LIST_MEMORIES") {
                let reply;
                if (!memories || memories.length === 0) {
                    reply = "I don't have any saved memories about you yet.";
                } else {
                    const items = memories
                        .map((m) => `• ${formatMemoryLabel(m.key)}: ${m.value}`)
                        .join("\n");
                    reply = `🧠 Here's what I remember:\n\n${items}`;
                }

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Memories listed successfully",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3C: Delete memory
            if (memoryCmd.action === "DELETE_MEMORY") {
                await Memory.findOneAndDelete({
                    userId: req.userId,
                    key: memoryCmd.memory.key,
                });

                const label = formatMemoryLabel(memoryCmd.memory.key).toLowerCase();
                const reply = `🗑️ I forgot your ${label}.`;

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Memory deleted successfully",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3D: Ambiguous delete (multiple matching memories found)
            if (memoryCmd.action === "AMBIGUOUS_DELETE") {
                const candidateList = memoryCmd.candidates
                    .map((m) => `${m.key} (${m.value})`)
                    .join(", ");
                const reply = `You have multiple memories related to "${memoryCmd.target}": ${candidateList}. Please specify which one you would like me to forget.`;

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Ambiguous memory delete request",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3E: Delete memory not found
            if (memoryCmd.action === "DELETE_NOT_FOUND") {
                const reply = `I couldn't find any saved memory about "${memoryCmd.target}" to forget.`;

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Memory not found to delete",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3F: Save memory (deterministic rule matched)
            if (memoryCmd.action === "SAVE_MEMORY") {
                const normalizedKey = normalizeMemoryKey(memoryCmd.key);
                const normalizedValue = memoryCmd.value.trim();

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

                const reply = `🧠 Got it. I'll remember that ${memoryCmd.description}.`;

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "Memory saved successfully",
                    response: reply,
                    conversationId: conversation._id,
                });
            }

            // Case 3G: Explicit save with AI extraction fallback
            if (memoryCmd.action === "SAVE_MEMORY_AI_FALLBACK") {
                const extracted = await extractMemories(trimmedMessage);

                if (extracted && extracted.length > 0) {
                    for (const item of extracted) {
                        const k = normalizeMemoryKey(item.key);
                        const v = item.value.trim();
                        await Memory.findOneAndUpdate(
                            { userId: req.userId, key: k },
                            { userId: req.userId, key: k, value: v },
                            { upsert: true, returnDocument: "after" }
                        );
                    }

                    const reply = `🧠 Got it. I'll remember that.`;
                    const conversation = await Conversation.create({
                        userId: req.userId,
                        message: trimmedMessage,
                        response: reply,
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Memory saved successfully",
                        response: reply,
                        conversationId: conversation._id,
                    });
                }
            }
        }

        // 4. Normal Conversation / Retrieval Flow
        const intent = await detectIntent(trimmedMessage);

        // 5. Get user profile
        const profile = await Profile.findOne({ userId: req.userId });
        const profileContext = profile
            ? `
Bio: ${profile.bio || ""}
Role: ${profile.role || ""}
Skills: ${profile.skills?.join(", ") || ""}
Interests: ${profile.interests?.join(", ") || ""}
Location: ${profile.location || ""}
`
            : "";

        // 6. Select relevant memories
        const relevantMemories = getRelevantMemories(memories, trimmedMessage);

        let memoryContext = formatMemoriesForAI(relevantMemories);

        // Anti-hallucination guard: if user asks for personal information but none is in memory
        const isPersonalInquiry =
            intent === "personal_information" ||
            /\b(?:what|which|where|who)\b.*\b(?:my|do i|am i|did i)\b/i.test(
                trimmedMessage
            );

        if (isPersonalInquiry && relevantMemories.length === 0) {
            const profileWords = (profileContext || "").toLowerCase();
            const queryWords = trimmedMessage
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 2);
            const matchesProfile = queryWords.some(
                (w) =>
                    ["role", "bio", "skills", "location", "interests"].includes(w) &&
                    profileWords.includes(w)
            );

            if (!matchesProfile) {
                const reply = "I don't have that saved in my memory yet.";

                const conversation = await Conversation.create({
                    userId: req.userId,
                    message: trimmedMessage,
                    response: reply,
                });

                return res.status(200).json({
                    success: true,
                    message: "No memory found",
                    response: reply,
                    conversationId: conversation._id,
                });
            }
        }

        // 7. Get previous conversations
        const previousConversations = await Conversation.find({
            userId: req.userId,
        })
            .sort({ createdAt: -1 })
            .limit(10);

        previousConversations.reverse();

        const conversationContext = previousConversations
            .map((c) => `User: ${c.message}\nAssistant: ${c.response}`)
            .join("\n\n");

        // 8. Call AI Provider with graceful fallback
        let response;
        try {
            response = await callAI(
                trimmedMessage,
                conversationContext,
                memoryContext,
                intent,
                profileContext
            );
        } catch (aiErr) {
            console.error("AI Provider error, applying fallback:", aiErr);
            if (relevantMemories.length > 0) {
                const mem = relevantMemories[0];
                response = `Based on your saved memories, your ${formatMemoryLabel(mem.key).toLowerCase()} is ${mem.value}.`;
            } else if (isPersonalInquiry) {
                response = "I don't have that saved in my memory yet.";
            } else {
                throw aiErr;
            }
        }

        // 9. Save current conversation
        const conversation = await Conversation.create({
            userId: req.userId,
            message: trimmedMessage,
            response,
        });

        // 10. Background Memory Extraction:
        // ONLY extract if the intent was memory_update and it's NOT a question, NOT a browser action, NOT technical
        const isQuestion = trimmedMessage.includes("?") || /^(?:what|how|why|when|where|who|explain|tell me)\b/i.test(trimmedMessage);
        if (intent === "memory_update" && !isQuestion) {
            const extractedMemories = await extractMemories(trimmedMessage);

            for (const memory of extractedMemories) {
                if (!memory.key || !memory.value) continue;

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
        }

        // 11. Send response
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