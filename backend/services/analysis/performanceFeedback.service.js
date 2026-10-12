const {
    getPerformanceLevel
} = require("./feedback.service");


const calculatePerformanceFeedback = ({
    studentName,
    subject,
    totalMarks,
    obtainedMarks,
    correctAnswers,
    wrongAnswers,
    timeTaken,
    weakTopics,
    strongTopics
}) => {

    // ------------------------------------------------------
    // Basic validation
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // Numeric normalization
    // ------------------------------------------------------

    const numericTotalMarks =
        Number(totalMarks);

    const numericObtainedMarks =
        Number(obtainedMarks);

    const numericCorrectAnswers =
        Number(correctAnswers);

    const numericWrongAnswers =
        Number(wrongAnswers);

    const numericTimeTaken =
        Number(timeTaken);


    // ------------------------------------------------------
    // Marks validation
    // ------------------------------------------------------

    if (
        !Number.isFinite(numericTotalMarks) ||
        numericTotalMarks <= 0
    ) {
        throw new Error(
            "Total marks must be greater than zero."
        );
    }

    if (
        !Number.isFinite(numericObtainedMarks) ||
        numericObtainedMarks < 0 ||
        numericObtainedMarks > numericTotalMarks
    ) {
        throw new Error(
            "Obtained marks must be between 0 and total marks."
        );
    }


    // ------------------------------------------------------
    // Answer validation
    // ------------------------------------------------------

    if (
        !Number.isInteger(numericCorrectAnswers) ||
        numericCorrectAnswers < 0
    ) {
        throw new Error(
            "Correct answers must be a non-negative integer."
        );
    }

    if (
        !Number.isInteger(numericWrongAnswers) ||
        numericWrongAnswers < 0
    ) {
        throw new Error(
            "Wrong answers must be a non-negative integer."
        );
    }

    const totalAnswered =
        numericCorrectAnswers +
        numericWrongAnswers;

    if (totalAnswered === 0) {
        throw new Error(
            "At least one question must be answered."
        );
    }


    // ------------------------------------------------------
    // Time validation
    // ------------------------------------------------------

    if (
        !Number.isFinite(numericTimeTaken) ||
        numericTimeTaken < 0
    ) {
        throw new Error(
            "Time taken must be a non-negative number."
        );
    }


    // ------------------------------------------------------
    // Topic normalization
    // ------------------------------------------------------

    const normalizedWeakTopics =
        Array.isArray(weakTopics)
            ? weakTopics
            : [];

    const normalizedStrongTopics =
        Array.isArray(strongTopics)
            ? strongTopics
            : [];


    // ------------------------------------------------------
    // Deterministic calculations
    // ------------------------------------------------------

    const percentage =
        Number(
            (
                (numericObtainedMarks /
                    numericTotalMarks) *
                100
            ).toFixed(2)
        );


    const accuracy =
        Number(
            (
                (numericCorrectAnswers /
                    totalAnswered) *
                100
            ).toFixed(2)
        );


    const performanceLevel =
        getPerformanceLevel(
            percentage
        );


    // ------------------------------------------------------
    // Final deterministic analysis
    // ------------------------------------------------------

    return {
        studentName,
        subject,

        totalMarks:
            numericTotalMarks,

        obtainedMarks:
            numericObtainedMarks,

        percentage,

        correctAnswers:
            numericCorrectAnswers,

        wrongAnswers:
            numericWrongAnswers,

        accuracy,

        timeTaken:
            numericTimeTaken,

        performanceLevel,

        strengths:
            normalizedStrongTopics,

        areasForImprovement:
            normalizedWeakTopics
    };
};


module.exports = {
    calculatePerformanceFeedback
};