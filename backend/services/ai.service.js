const callAI = async (message) => {
    try {
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

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a helpful personal AI assistant. Give clear, accurate and easy-to-understand answers.",
                        },
                        {
                            role: "user",
                            content: message,
                        },
                    ],
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