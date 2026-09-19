import { isSensitiveInfo, normalizeMemoryKey } from "../utils/memory.utils.js";

// Phrases that indicate normal knowledge questions or commands which must NEVER be extracted as memories
const NON_MEMORY_PATTERNS = [
    /^(?:what is|what are|explain|how to|how does|how do|why is|why does|tell me about|define|describe)\b/i,
    /^(?:open|launch|visit|start|go to)\b/i,
    /^(?:search|find|lookup)\b/i,
    /^(?:hello|hi|hey|greetings|good morning|good evening|good afternoon)\b/i,
];

const extractMemories = async (message) => {
    try {
        if (!message || typeof message !== "string") {
            return [];
        }

        const trimmed = message.trim();

        // 1. Sensitive Data Check - never extract sensitive data
        if (isSensitiveInfo(trimmed)) {
            return [];
        }

        // 2. Filter out normal technical, general questions, greetings, or browser commands
        if (NON_MEMORY_PATTERNS.some((pattern) => pattern.test(trimmed))) {
            return [];
        }

        // 3. Must contain some personal statement or memory marker
        const hasPersonalMarker =
            /\b(my|i am|i use|i work|i live|i prefer|i like|i love|remember|don't forget|keep in mind)\b/i.test(
                trimmed
            );

        if (!hasPersonalMarker) {
            return [];
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "system",
                            content: `
You are a precise memory extraction assistant.

Your job is to identify important, persistent personal facts about the user that should be remembered for future conversations.

Only save long-term useful facts such as:
- user's name
- preferred programming language or tool
- favorite things
- important persistent preferences
- user's primary goals
- user's profession or role

Do NOT save:
- temporary questions or queries
- general knowledge explanations
- normal conversation or greetings
- one-time requests or action commands
- passwords, tokens, API keys, or credentials

You MUST return a JSON object with this exact structure:
{
    "memories": [
        {
            "key": "dsa_language",
            "value": "Java"
        }
    ]
}

If there is nothing important to remember, return exactly:
{
    "memories": []
}

Do not return explanations.
Return only valid JSON.
`,
                        },
                        {
                            role: "user",
                            content: trimmed,
                        },
                    ],
                    response_format: {
                        type: "json_object",
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Memory AI Error:", data);
            return [];
        }

        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
            return [];
        }

        try {
            const cleanedContent = content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const result = JSON.parse(cleanedContent);

            if (!Array.isArray(result?.memories)) {
                return [];
            }

            // Filter out any sensitive or empty items
            return result.memories.filter(
                (m) =>
                    m &&
                    m.key &&
                    m.value &&
                    !isSensitiveInfo(m.key) &&
                    !isSensitiveInfo(m.value) &&
                    normalizeMemoryKey(m.key).length > 0
            );
        } catch {
            return [];
        }
    } catch (error) {
        console.error("Memory Service Error:", error);
        return [];
    }
};

export default extractMemories;