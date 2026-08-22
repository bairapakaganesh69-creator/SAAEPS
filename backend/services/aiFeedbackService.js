const AI_URL = "http://127.0.0.1:1234/v1/chat/completions";

const MODEL =
    "C:\\Users\\gpt-warriors\\.lmstudio\\models\\lmstudio-community\\Qwen3-4B-GGUF\\Qwen3-4B-Q4_K_M.gguf";

/**
 * Generate AI-powered feedback using local Qwen3 through llama.cpp.
 */
const generateAIFeedback = async (analyzedTopics) => {
    const weakTopics = analyzedTopics.filter(
        (topic) => topic.status === "Weak"
    );

    const improvementTopics = analyzedTopics.filter(
        (topic) => topic.status === "Needs Improvement"
    );

    const goodTopics = analyzedTopics.filter(
        (topic) => topic.status === "Good"
    );

    const insufficientDataTopics =
        analyzedTopics.filter(
            (topic) =>
                topic.status === "Not Enough Data"
        );

    // Overall message based on calculated performance
    let overallMessage;

    if (weakTopics.length > 0) {
        overallMessage =
            "You have some weak areas that need focused attention.";
    } else if (improvementTopics.length > 0) {
        overallMessage =
            "Your performance is progressing, but some topics need more practice.";
    } else if (goodTopics.length > 0) {
        overallMessage =
            "Great job! You are performing well.";
    } else {
        overallMessage =
            "Attempt more tests so we can understand your performance better.";
    }

    /*
     * Build a compact performance summary for the AI.
     * The AI does NOT calculate scores or classify topics.
     * Our backend already does that.
     */
    const topicData = analyzedTopics.map(
        (topic) => ({
            subject: topic.subject,
            topic: topic.topic,
            accuracy: topic.accuracy,
            attempted: topic.attempted,
            correct: topic.correct,
            wrong: topic.wrong,
            status: topic.status,
        })
    );

    let aiMessages = [];

    // Only call AI when there is topic data.
    if (topicData.length > 0) {
        try {
            const prompt = `/no_think

You are the SAAEPS AI Academic Assistant.

Analyze the student's topic performance and give concise, practical study recommendations.

Student performance:
${JSON.stringify(topicData)}

Rules:
- Use simple student-friendly English.
- Do not calculate or change any scores.
- Do not invent information.
- Focus on the provided weak and improvement topics.
- Give exactly 3 short recommendations.
- Each recommendation must be one sentence.
- Maximum 80 words total.
- Do not explain your reasoning.
- Do not use markdown headings.
- Return only the 3 numbered recommendations.`;

            const response = await fetch(
                AI_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
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

                        max_tokens: 150,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `AI server returned ${response.status}`
                );
            }

            const data =
                await response.json();

            const aiText =
                data?.choices?.[0]?.message
                    ?.content
                    ?.trim();

            if (aiText) {
                aiMessages =
                    aiText
                        .split("\n")
                        .map((line) =>
                            line
                                .replace(
                                    /^\s*\d+[\.\)]\s*/,
                                    ""
                                )
                                .trim()
                        )
                        .filter(Boolean)
                        .slice(0, 3);
            }
        } catch (error) {
            console.error(
                "Local AI Feedback Error:",
                error.message
            );
        }
    }

    /*
     * Fallback recommendations.
     * These are used if llama.cpp is unavailable
     * or the AI response is invalid.
     */
    if (aiMessages.length === 0) {
        aiMessages = [];

        weakTopics
            .slice(0, 3)
            .forEach((topic) => {
                aiMessages.push(
                    `Revise the basic concepts of ${topic.topic} and practice more questions.`
                );
            });

        improvementTopics
            .slice(
                0,
                Math.max(
                    0,
                    3 - aiMessages.length
                )
            )
            .forEach((topic) => {
                aiMessages.push(
                    `Practice more ${topic.topic} questions and review your mistakes carefully.`
                );
            });

        goodTopics
            .slice(
                0,
                Math.max(
                    0,
                    3 - aiMessages.length
                )
            )
            .forEach((topic) => {
                aiMessages.push(
                    `Keep practicing ${topic.topic} with medium and hard questions to improve further.`
                );
            });

        insufficientDataTopics
            .slice(
                0,
                Math.max(
                    0,
                    3 - aiMessages.length
                )
            )
            .forEach((topic) => {
                aiMessages.push(
                    `Attempt more ${topic.topic} questions so your performance can be analyzed reliably.`
                );
            });
    }

    /*
     * Convert AI recommendations into the
     * existing SAAEPS recommendation structure.
     */
    const recommendations = [];

const prioritizedTopics = [
    ...weakTopics,
    ...improvementTopics,
    ...goodTopics,
    ...insufficientDataTopics,
];

// If there are topics, attach AI recommendations
// to the most relevant topics.
if (prioritizedTopics.length > 0) {
    aiMessages.forEach((message, index) => {
        // Cycle through available topics so that
        // every recommendation has valid topic data.
        const topic =
            prioritizedTopics[
                index % prioritizedTopics.length
            ];

        let priority = "Low";

        if (topic.status === "Weak") {
            priority = "High";
        } else if (
            topic.status === "Needs Improvement"
        ) {
            priority = "Medium";
        }

        recommendations.push({
            subject: topic.subject,
            topic: topic.topic,
            priority,
            accuracy: topic.accuracy,
            message,
        });
    });
}

    return {
        overallMessage,

        summary: {
            totalTopicsAnalyzed:
                analyzedTopics.length,

            weakTopics:
                weakTopics.length,

            needsImprovement:
                improvementTopics.length,

            goodTopics:
                goodTopics.length,

            notEnoughData:
                insufficientDataTopics.length,
        },

        recommendations,

        weakTopics,

        improvementTopics,

        goodTopics,

        insufficientDataTopics,
    };
};

module.exports = {
    generateAIFeedback,
};