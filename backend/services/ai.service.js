const callAI = async (
    message,
    conversationContext = "",
    memoryContext = ""
) => {
    try {
        const messages = [
            {
                role: "system",
                content:
                    "You are a helpful personal AI assistant. Give clear, accurate and easy-to-understand answers.",
            },
        ];

        // Add previous conversation context
        if (conversationContext) {
            messages.push({
                role: "system",
                content: `Here is the user's recent conversation history. Use it only when it is relevant to the current question:

${conversationContext}`,
            });
        }

        // Add user's long-term memories
        if (memoryContext) {
            messages.push({
                role: "system",
                content: `Here are some important facts remembered about the user. Use them only when they are relevant to the current request:

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

        const aiResponse = data?.choices?.[0]?.message?.content;

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