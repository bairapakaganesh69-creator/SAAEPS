const Question = require("../models/Question");
const Topic = require("../models/Topic");
const Subject = require("../models/Subject");
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
            topicId
        } = req.body;

        const newQuestion = await Question.create({
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
            topicId
        });

        res.status(201).json({
            success: true,
            message: "Question Created Successfully",
            question: newQuestion
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const getQuestions = async (req, res) => {
    try {

        const questions = await Question.findAll({
            include: [
                {
                    model: Subject
                },
                {
                    model: Topic
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: questions.length,
            questions
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const getQuestionsByTopic = async (req, res) => {
    try {

        const { topicId } = req.params;

        const questions = await Question.findAll({
            where: {
                topicId
            }
        });

        res.status(200).json({
            success: true,
            count: questions.length,
            questions
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
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
            topicId
        } = req.body;

        // Find Question
        const existingQuestion = await Question.findByPk(id);

        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        // Check Subject
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Check Topic
        const topic = await Topic.findByPk(topicId);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
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
            topicId
        });

        res.status(200).json({
            success: true,
            message: "Question Updated Successfully",
            question: existingQuestion
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const deleteQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        // Find Question
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        // Delete Question
        await question.destroy();

        res.status(200).json({
            success: true,
            message: "Question Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
module.exports = {
    createQuestion,
    getQuestions,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion
};