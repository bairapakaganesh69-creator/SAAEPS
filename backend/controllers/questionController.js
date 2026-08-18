const Question = require("../models/Question");
const Topic = require("../models/Topic");
const Subject = require("../models/Subject");

// --------------------------------
// CREATE QUESTION
// --------------------------------

const createQuestion = async (req, res) => {
    try {
        const {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            difficulty,
            marks,
            explanation,
            subjectId,
            topicId,
        } = req.body;

        // Check Subject
        const subject = await Subject.findByPk(
            subjectId
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        // Check Topic
        const topic = await Topic.findByPk(
            topicId
        );

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found",
            });
        }

        // Create Question
        const newQuestion =
            await Question.create({
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                difficulty,
                marks,
                explanation,
                subjectId,
                topicId,
            });

        return res.status(201).json({
            success: true,
            message:
                "Question Created Successfully",
            question: newQuestion,
        });
    } catch (error) {
        console.error(
            "Create Question Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// GET ALL QUESTIONS
// --------------------------------

const getQuestions = async (req, res) => {
    try {
        const questions =
            await Question.findAll({
                include: [
                    {
                        model: Subject,
                    },
                    {
                        model: Topic,
                    },
                ],
            });

        return res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error(
            "Get Questions Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// GET QUESTIONS BY TOPIC
// --------------------------------

const getQuestionsByTopic = async (
    req,
    res
) => {
    try {
        const { topicId } = req.params;

        const questions =
            await Question.findAll({
                where: {
                    topicId,
                },
            });

        return res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error(
            "Get Questions By Topic Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// UPDATE QUESTION
// --------------------------------

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            difficulty,
            marks,
            explanation,
            subjectId,
            topicId,
        } = req.body;

        // Find Question
        const existingQuestion =
            await Question.findByPk(id);

        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Check Subject
        const subject =
            await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        // Check Topic
        const topic =
            await Topic.findByPk(topicId);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found",
            });
        }

        // Update Question
        await existingQuestion.update({
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            difficulty,
            marks,
            explanation,
            subjectId,
            topicId,
        });

        return res.status(200).json({
            success: true,
            message:
                "Question Updated Successfully",
            question: existingQuestion,
        });
    } catch (error) {
        console.error(
            "Update Question Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// DELETE QUESTION
// --------------------------------

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Find Question
        const question =
            await Question.findByPk(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Delete Question
        await question.destroy();

        return res.status(200).json({
            success: true,
            message:
                "Question Deleted Successfully",
        });
    } catch (error) {
        console.error(
            "Delete Question Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion,
};