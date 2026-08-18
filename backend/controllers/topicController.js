const Topic = require("../models/Topic");
const Subject = require("../models/Subject");

// Create Topic
const createTopic = async (req, res) => {
    try {

        const { name, subjectId } = req.body;

        // Check Subject Exists
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Check Duplicate Topic
        const existingTopic = await Topic.findOne({
            where: {
                name,
                subjectId
            }
        });

        if (existingTopic) {
            return res.status(400).json({
                success: false,
                message: "Topic already exists in this subject"
            });
        }

        const topic = await Topic.create({
            name,
            subjectId
        });

        res.status(201).json({
            success: true,
            message: "Topic Created Successfully",
            topic
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// Get All Topics
const getTopics = async (req, res) => {

    try {

        const topics = await Topic.findAll({
            include: Subject
        });

        res.status(200).json({
            success: true,
            count: topics.length,
            topics
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Get Topics by Subject
const getTopicsBySubject = async (req, res) => {

    try {

        const { subjectId } = req.params;

        const topics = await Topic.findAll({
            where: { subjectId }
        });

        res.status(200).json({
            success: true,
            count: topics.length,
            topics
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subjectId } = req.body;

        // Find Topic
        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found",
            });
        }

        // Check Subject Exists
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        // Check Duplicate Topic
        const existingTopic = await Topic.findOne({
            where: {
                name,
                subjectId,
            },
        });

        if (
            existingTopic &&
            Number(existingTopic.id) !== Number(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Topic already exists in this subject",
            });
        }

        // Update Topic
        topic.name = name;
        topic.subjectId = subjectId;

        await topic.save();

        res.status(200).json({
            success: true,
            message: "Topic Updated Successfully",
            topic,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const deleteTopic = async (req, res) => {
    try {

        const { id } = req.params;

        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        await topic.destroy();

        res.status(200).json({
            success: true,
            message: "Topic Deleted Successfully"
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
    createTopic,
    getTopics,
    getTopicsBySubject,
    updateTopic,
    deleteTopic,
};