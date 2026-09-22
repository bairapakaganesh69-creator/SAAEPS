const getPerformanceLevel = (percentage) => {

    const numericPercentage = Number(percentage);

    if (
        Number.isNaN(numericPercentage) ||
        numericPercentage < 0 ||
        numericPercentage > 100
    ) {
        throw new Error(
            "Percentage must be a number between 0 and 100."
        );
    }

    if (numericPercentage >= 85) {
        return "Excellent";
    }

    if (numericPercentage >= 70) {
        return "Good";
    }

    if (numericPercentage >= 50) {
        return "Satisfactory";
    }

    return "Needs Improvement";
};


const normalizeTopics = (topics) => {

    if (topics === undefined || topics === null) {
        return [];
    }

    if (!Array.isArray(topics)) {
        throw new Error(
            "Topics must be provided as an array."
        );
    }

    return topics;
};


const analyzeFeedback = ({
    studentName,
    subject,
    percentage,
    weakTopics,
    strongTopics
}) => {

    if (
        !studentName ||
        typeof studentName !== "string"
    ) {
        throw new Error(
            "Student name is required."
        );
    }

    if (
        !subject ||
        typeof subject !== "string"
    ) {
        throw new Error(
            "Subject is required."
        );
    }

    const numericPercentage = Number(percentage);

    if (
        Number.isNaN(numericPercentage) ||
        numericPercentage < 0 ||
        numericPercentage > 100
    ) {
        throw new Error(
            "Percentage must be a number between 0 and 100."
        );
    }

    const normalizedWeakTopics =
        normalizeTopics(weakTopics);

    const normalizedStrongTopics =
        normalizeTopics(strongTopics);

    const performanceLevel =
        getPerformanceLevel(
            numericPercentage
        );

    return {
        studentName,
        subject,
        percentage: numericPercentage,
        performanceLevel,
        strengths: normalizedStrongTopics,
        areasForImprovement: normalizedWeakTopics
    };
};


module.exports = {
    analyzeFeedback,
    getPerformanceLevel
};