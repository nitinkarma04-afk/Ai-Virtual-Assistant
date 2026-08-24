const MAX_CONVERSATION_CONTEXT = 6000;
const MAX_MEMORY_CONTEXT = 3000;

const limitContext = (context, maxLength) => {
    if (!context) {
        return "";
    }

    if (context.length <= maxLength) {
        return context;
    }

    // Keep the most recent context because it is more relevant
    return context.slice(-maxLength);
};

const callAI = async (
    message,
    conversationContext = "",
    memoryContext = "",
    intent = "general_question"
) => {

    try {

        // --------------------------------
        // 1. Limit conversation context
        // --------------------------------

        const limitedConversationContext = limitContext(
            conversationContext,
            MAX_CONVERSATION_CONTEXT
        );

        // --------------------------------
        // 2. Limit memory context
        // --------------------------------

        const limitedMemoryContext = limitContext(
            memoryContext,
            MAX_MEMORY_CONTEXT
        );

        // --------------------------------
        // 3. Create AI messages
        // --------------------------------

        const messages = [
            {
                role: "system",

                content: `
You are a helpful personal AI assistant.

Your responsibilities:

- Give clear, accurate, concise, and easy-to-understand answers.
- Always prioritize the user's current message.
- Use conversation history only when it is relevant to the current question.
- Use saved user memories only when they are relevant to the current request.
- Do not mention memories, profile, database, or internal system information unless the user specifically asks about them.
- Never invent, guess, or assume personal information about the user.
- If a personal fact is not available in the provided memories or relevant conversation history, clearly say that you do not have that information.
- If you know a personal fact from the provided memories, answer it naturally.
- Do not force personal memories into normal technical or general questions.
- Do not unnecessarily repeat the user's personal information.
- If the user asks a normal technical/general question, answer it directly and naturally.
- If you do not know something, say so clearly instead of making up an answer.
- Maintain a natural, helpful, and conversational tone.

CONTEXT PRIORITY RULES:

1. CURRENT USER MESSAGE has the highest priority.

2. If the current user message contradicts an older conversation message,
   follow the current user message.

3. CONVERSATION HISTORY has the second priority.
   Use it when the current message refers to something discussed earlier.

4. USER MEMORY has the third priority.
   Use saved memories only when they are relevant to the current request.

5. GENERAL KNOWLEDGE should be used when the answer cannot be determined
   from the current message, relevant conversation context, or relevant memory.

IMPORTANT PRIORITY BEHAVIOR:

- Never allow an old memory to override the user's current statement.
- Never allow an old conversation message to override the user's current statement.
- If the user provides a new personal fact, treat the new information as the latest information.
- If the user asks about their personal information, use the most recent relevant information available.
- Do not combine conflicting old and new personal information unless the user asks about the history or change.
- If current information conflicts with older information, prefer the current information.
- Do not mention these priority rules in your response.

CONTEXT CONTROL RULES:

- The provided conversation history may be truncated.
- The provided memory context may be limited.
- Do not assume that missing context means the information does not exist.
- Always prioritize the current user message over all context.
- Use only the context that is actually provided.
`
            }
        ];

        // --------------------------------
        // 4. Add conversation context
        // --------------------------------

        if (limitedConversationContext) {

            messages.push({
                role: "system",

                content: `
Here is the user's recent conversation history.

Use this information only when it is relevant to the current question.

Conversation history has lower priority than the current user message.

The conversation history may have been shortened to control context size.

Do not assume that every previous conversation is relevant.

${limitedConversationContext}
`
            });
        }

        // --------------------------------
        // 5. Add memory context
        // --------------------------------

        if (limitedMemoryContext) {

            messages.push({
                role: "system",

                content: `
Here are important facts remembered about the user.

Use these facts only when they are relevant to the current request.

Memory has lower priority than the current user message and conversation history.

The memory context may have been shortened to control context size.

If a current user message conflicts with a stored memory, follow the current user message.

Do not invent any additional personal information.

If a requested personal fact is not present here or in the relevant conversation history, say that you do not have that information.

${limitedMemoryContext}
`
            });
        }

        // --------------------------------
        // 6. Add intent information
        // --------------------------------

        if (intent) {

            messages.push({
                role: "system",

                content: `
Detected user intent:

${intent}

Use this intent only as supporting information.
The current user message always has higher priority.
`
            });
        }

        // --------------------------------
        // 7. Add current user message
        // --------------------------------

        messages.push({
            role: "user",
            content: message
        });

        // --------------------------------
        // 8. Call OpenRouter
        // --------------------------------

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`
                },

                body: JSON.stringify({
                    model: "openrouter/free",
                    messages
                })
            }
        );

        // --------------------------------
        // 9. Read response
        // --------------------------------

        const data = await response.json();

        if (!response.ok) {

            console.error("OpenRouter Error:", data);

            throw new Error(
                data?.error?.message ||
                "AI API request failed"
            );
        }

        // --------------------------------
        // 10. Extract AI response
        // --------------------------------

        const aiResponse =
            data?.choices?.[0]?.message?.content;

        if (!aiResponse) {

            throw new Error(
                "AI returned an empty response"
            );
        }

        return aiResponse;

    } catch (error) {

        console.error(
            "AI Service Error:",
            error
        );

        throw error;
    }
};

export default callAI;