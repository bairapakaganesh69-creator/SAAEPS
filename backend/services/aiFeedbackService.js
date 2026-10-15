
const AI_BASE_URL = (
    process.env.LLAMA_CPP_BASE_URL ||
    "http://127.0.0.1:1234"
).replace(/\/+$/, "");

const AI_URL = `${AI_BASE_URL}/v1/chat/completions`;

const MODEL =
    process.env.LLAMA_CPP_MODEL_PATH || "Qwen3";

const MAX_RECOMMENDATIONS = 3;

const getFallbackRecommendations = (topics) => {
    const recommendations = [];

    const fallbackByStatus = {
        Weak: (topic) =>
            `Focus on ${topic.topic}. Review the core concepts, solve practice questions, and revisit incorrect answers.`,

        "Needs Improvement": (topic) =>
            `Improve your accuracy in ${topic.topic} through focused practice and revision.`,

        Good: (topic) =>
            `Maintain your performance in ${topic.topic} with regular revision and timed practice.`,

        "Not Enough Data": (topic) =>
            `Complete more questions in ${topic.topic} to build a reliable performance assessment.`,
    };

    for (const topic of topics) {
        const createMessage = fallbackByStatus[topic.status];

        if (!createMessage) continue;

        recommendations.push({
            topic,
            message: createMessage(topic),
        });

        if (recommendations.length >= MAX_RECOMMENDATIONS) {
            break;
        }
    }

    return recommendations;
};

const parseAIRecommendations = (content) => {
    if (typeof content !== "string" || !content.trim()) {
        return [];
    }

    return content
        .split(/\r?\n/)
        .map((line) =>
            line
                .trim()
                .replace(/^(?:\d+[\.\)]|[-*•])\s*/, "")
                .trim()
        )
        .filter(Boolean)
        .slice(0, MAX_RECOMMENDATIONS);
};

const generateAIFeedback = async (analyzedTopics = []) => {
    if (!Array.isArray(analyzedTopics)) {
        throw new TypeError("Analyzed topics must be an array.");
    }

    const weakTopics = analyzedTopics.filter(
        (topic) => topic.status === "Weak"
    );

    const improvementTopics = analyzedTopics.filter(
        (topic) => topic.status === "Needs Improvement"
    );

    const goodTopics = analyzedTopics.filter(
        (topic) => topic.status === "Good"
    );

    const insufficientDataTopics = analyzedTopics.filter(
        (topic) => topic.status === "Not Enough Data"
    );

    const prioritizedTopics = [
        ...weakTopics,
        ...improvementTopics,
        ...goodTopics,
        ...insufficientDataTopics,
    ];

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

    const topicData = analyzedTopics.map((topic) => ({
        subject: topic.subject,
        topic: topic.topic,
        accuracy: topic.accuracy,
        attempted: topic.attempted,
        correct: topic.correct,
        wrong: topic.wrong,
        status: topic.status,
    }));

    let aiMessages = [];

    if (topicData.length > 0) {
        try {
            const prompt = `/no_think

You are the SAAEPS AI Academic Assistant.

Analyze the student's topic performance and provide concise, practical study recommendations.

Student performance:
${JSON.stringify(topicData)}

Rules:
- Use simple student-friendly English.
- Do not calculate or change scores.
- Do not invent student information.
- Focus first on weak and improvement topics.
- Return exactly 3 short, numbered recommendations.
- Each recommendation must be one sentence.
- Use no more than 80 words in total.
- Do not use headings or explain your reasoning.`;

            const response = await fetch(AI_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: AbortSignal.timeout(60000),
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
                    chat_template_kwargs: {
                        enable_thinking: false,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `AI server returned ${response.status}`
                );
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;

            aiMessages = parseAIRecommendations(content);
        } catch (error) {
            console.error(
                "Local AI Feedback Error:",
                error.message
            );
        }
    }

    /*
     * Assign each AI message to a distinct topic where possible.
     * Use deterministic fallback messages for remaining topics.
     */
    const aiRecommendations = aiMessages
        .slice(0, MAX_RECOMMENDATIONS)
        .map((message, index) => {
            const topic = prioritizedTopics[index] ?? null;

            let priority = "Low";

            if (topic?.status === "Weak") {
                priority = "High";
            } else if (topic?.status === "Needs Improvement") {
                priority = "Medium";
            }

            return {
                subject: topic?.subject ?? null,
                topic: topic?.topic ?? null,
                priority,
                accuracy: topic?.accuracy ?? null,
                message,
            };
        });

    const usedTopics = new Set(
        aiRecommendations
            .map((item) => item.topic)
            .filter(Boolean)
    );

    const remainingTopics = prioritizedTopics.filter(
        (topic) => !usedTopics.has(topic.topic)
    );

    const fallbackRecommendations = getFallbackRecommendations(
        remainingTopics
    ).map(({ topic, message }) => {
        let priority = "Low";

        if (topic.status === "Weak") {
            priority = "High";
        } else if (topic.status === "Needs Improvement") {
            priority = "Medium";
        }

        return {
            subject: topic.subject ?? null,
            topic: topic.topic ?? null,
            priority,
            accuracy: topic.accuracy ?? null,
            message,
        };
    });

    const recommendations = [
        ...aiRecommendations,
        ...fallbackRecommendations,
    ].slice(0, MAX_RECOMMENDATIONS);

    return {
        overallMessage,
        summary: {
            totalTopicsAnalyzed: analyzedTopics.length,
            weakTopics: weakTopics.length,
            needsImprovement: improvementTopics.length,
            goodTopics: goodTopics.length,
            notEnoughData: insufficientDataTopics.length,
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
