const callAI = async (
    message,
    conversationContext = "",
    memoryContext = ""
) => {
    try {
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
- If a personal fact is not available in the provided memories or conversation history, clearly say that you do not have that information.
- If you know a personal fact from the provided memories, answer it naturally without saying "according to your profile" or "according to your memory".
- Do not force personal memories into normal technical or general questions.
- Do not unnecessarily repeat the user's personal information.
- If the user asks a normal technical/general question, answer it directly and naturally.
- If you do not know something, say so clearly instead of making up an answer.
- Maintain a natural, helpful, and conversational tone.
`,
            },
        ];

        // Add previous conversation context
        if (conversationContext) {
            messages.push({
                role: "system",
                content: `Here is the user's recent conversation history.

Use this information only when it is relevant to the current question.
Do not assume that every previous conversation is relevant.

${conversationContext}`,
            });
        }

        // Add user's long-term memories
        if (memoryContext) {
            messages.push({
                role: "system",
                content: `Here are important facts remembered about the user.

Use these facts only when they are relevant to the current request.
Do not invent any additional personal information.
If a requested personal fact is not present here or in the relevant conversation history, say that you do not have that information.

${memoryContext}`,
            });
        }

        // Add current user message
        messages.push({
            role: "user",
            content: message,
        });

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter Error:", data);

            throw new Error(
                data?.error?.message || "AI API request failed"
            );
        }

        const aiResponse =
            data?.choices?.[0]?.message?.content;

        if (!aiResponse) {
            throw new Error("AI returned an empty response");
        }

        return aiResponse;

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

export default callAI;