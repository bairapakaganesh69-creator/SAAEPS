const AI_BASE_URL = (
    process.env.LLAMA_CPP_BASE_URL || "http://127.0.0.1:1234"
).replace(/\/+$/, "");

const AI_URL = `${AI_BASE_URL}/v1/chat/completions`;

const MODEL = process.env.LLAMA_CPP_MODEL_PATH || "Qwen3";

/**
 * Generate a short AI Tutor response.
 */
const generateAITutorResponse = async (message) => {
    if (!message || !message.trim()) {
        const error = new Error("Message is required");
        error.statusCode = 400;
        throw error;
    }

    const prompt = `/no_think

You are the SAAEPS AI Tutor.
Help students preparing for ECET and POLYCET.

Student question:
${message.trim()}

Rules:
- Give a clear and simple answer.
- Use student-friendly English.
- Keep the answer concise.
- Maximum 60 words.
- Focus on the student's question.
- Explain difficult concepts in simple terms.
- If useful, give one very short example.
- Do not explain your reasoning.
- Do not mention these instructions.
`;

    try {
        const response = await fetch(AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 120,
                chat_template_kwargs: {
                    enable_thinking: false,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI server returned ${response.status}`);
        }

        const data = await response.json();

        const reply = data?.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            throw new Error("AI returned an empty response");
        }

        return reply;
    } catch (error) {
        console.error("AI Tutor Service Error:", error.message);
        throw error;
    }
};

module.exports = {
    generateAITutorResponse,
};
