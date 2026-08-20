 const extractMemories = async (message) => {
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
                            content: `
You are a memory extraction assistant.

Your job is to identify important information about the user
that should be remembered for future conversations.

Only save long-term useful information such as:
- user's name
- preferred programming language
- favorite things
- important preferences
- user's goals
- user's profession or role

Do NOT save:
- temporary questions
- general knowledge
- normal conversation
- one-time requests

Return ONLY valid JSON in this exact format:

{
  "memories": [
    {
      "key": "name",
      "value": "Nitin"
    }
  ]
}

If there is nothing important to remember, return:

{
  "memories": []
}
                            `,
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
            console.error("Memory AI Error:", data);

            throw new Error(
                data?.error?.message || "Memory extraction failed"
            );
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

    return result.memories || [];
} catch (parseError) {
    console.error("Memory JSON Parse Error:", parseError);
    return [];
}

    } catch (error) {
        console.error("Memory Service Error:", error);

        return [];
    }
};

export default extractMemories;