const WEAK_THRESHOLD = 50;
const STRONG_THRESHOLD = 70;

const calculateOverallPercentage = (
    totalMarks,
    obtainedMarks
) => {
    if (
        typeof totalMarks !== "number" ||
        typeof obtainedMarks !== "number"
    ) {
        throw new Error(
            "Total marks and obtained marks must be numbers."
        );
    }

    if (totalMarks <= 0) {
        throw new Error(
            "Total marks must be greater than zero."
        );
    }

    if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
        throw new Error(
            "Obtained marks must be between 0 and total marks."
        );
    }

    return Number(
        ((obtainedMarks / totalMarks) * 100).toFixed(2)
    );
};


const classifyTopic = (score) => {
    if (
        typeof score !== "number" ||
        Number.isNaN(score)
    ) {
        throw new Error(
            "Chapter score must be a valid number."
        );
    }

    if (score < 0 || score > 100) {
        throw new Error(
            "Chapter score must be between 0 and 100."
        );
    }

    if (score < WEAK_THRESHOLD) {
        return "weak";
    }

    if (score < STRONG_THRESHOLD) {
        return "average";
    }

    return "strong";
};


const analyzeWeakTopics = ({
    subject,
    totalMarks,
    obtainedMarks,
    chapterScores
}) => {

    if (!subject || typeof subject !== "string") {
        throw new Error(
            "Subject is required."
        );
    }

    if (!Array.isArray(chapterScores)) {
        throw new Error(
            "Chapter scores must be an array."
        );
    }

    if (chapterScores.length === 0) {
        throw new Error(
            "At least one chapter score is required."
        );
    }

    const overallPercentage =
        calculateOverallPercentage(
            totalMarks,
            obtainedMarks
        );

    const weakTopics = [];
    const averageTopics = [];
    const strongTopics = [];

    chapterScores.forEach((chapter) => {

        if (!chapter || typeof chapter !== "object") {
            throw new Error(
                "Each chapter score must be an object."
            );
        }

        const {
            chapter: chapterName,
            score
        } = chapter;

        if (
            !chapterName ||
            typeof chapterName !== "string"
        ) {
            throw new Error(
                "Each chapter must have a valid chapter name."
            );
        }

        const numericScore = Number(score);

        if (
            Number.isNaN(numericScore) ||
            numericScore < 0 ||
            numericScore > 100
        ) {
            throw new Error(
                `Invalid score for chapter: ${chapterName}. Score must be between 0 and 100.`
            );
        }

        const normalizedChapter = {
            chapter: chapterName,
            score: numericScore
        };

        const classification =
            classifyTopic(numericScore);

        if (classification === "weak") {
            weakTopics.push(normalizedChapter);
        }

        if (classification === "average") {
            averageTopics.push(normalizedChapter);
        }

        if (classification === "strong") {
            strongTopics.push(normalizedChapter);
        }
    });

    return {
        subject,
        overallPercentage,
        weakTopics,
        averageTopics,
        strongTopics
    };
};


module.exports = {
    analyzeWeakTopics
};