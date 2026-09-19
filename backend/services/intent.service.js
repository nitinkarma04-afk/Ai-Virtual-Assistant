const detectIntent = async (message) => {
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
You are an intent classification assistant.

Your job is to identify the user's primary intent from their message.

Choose ONLY ONE of these intents:

- greeting
- personal_information
- memory_update
- technical_question
- conversation_recall
- general_question

Definitions:

greeting:
The user is greeting or starting a casual conversation.

personal_information:
The user is asking about information that is already known about themselves.

Examples:
"What is my favorite food?"
"What programming language do I prefer?"
"What is my goal?"

memory_update:
The user is sharing new personal information that should be remembered.

Examples:
"My favorite programming language is Python."
"I like pizza."
"My goal is to become a backend developer."

technical_question:
The user is asking about programming, software, computer science, development, or another technical topic.

Examples:
"Explain polymorphism."
"What is MongoDB?"
"How does REST API work?"

conversation_recall:
The user is asking about something discussed earlier in the conversation.

Examples:
"What did we discuss earlier?"
"What was the last topic?"
"Do you remember what I told you?"

general_question:
Any normal question that does not belong to the above categories.

IMPORTANT RULES:

- Return ONLY valid JSON.
- Do not return markdown.
- Do not return explanations.
- Do not return extra text.

Return exactly this format:

{
    "intent": "technical_question"
}

If unsure, use:

{
    "intent": "general_question"
}
`,
                        },

                        {
                            role: "user",
                            content: message,
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
            console.error("Intent AI Error:", data);

            throw new Error(
                data?.error?.message || "Intent detection failed"
            );
        }

        const content =
            data?.choices?.[0]?.message?.content;

        if (!content) {
            return "general_question";
        }

        const cleanedContent = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const allowedIntents = [
            "greeting",
            "personal_information",
            "memory_update",
            "technical_question",
            "conversation_recall",
            "general_question",
        ];

        let result;

        try {
            const jsonMatch = cleanedContent.match(/\{[\s\S]*?\}/);
            result = JSON.parse(jsonMatch ? jsonMatch[0] : cleanedContent);
        } catch (jsonError) {
            const regexMatch = content.match(/"intent"\s*:\s*"([a-z_]+)"/i);
            if (regexMatch && allowedIntents.includes(regexMatch[1].toLowerCase())) {
                return regexMatch[1].toLowerCase();
            }

            console.warn(
                "Intent AI returned non-standard format. Using fallback intent."
            );

            return "general_question";
        }

        if (!allowedIntents.includes(result?.intent)) {
            return "general_question";
        }

        return result.intent;

    } catch (error) {
        console.warn(
            "Intent processing failed. Using fallback intent."
        );

        return "general_question";
    }
};

export default detectIntent;