const Subject = require("../models/Subject");

// Create Subject
const createSubject = async (req, res) => {
    try {

        const { name, description } = req.body;

        const existingSubject = await Subject.findOne({
            where: { name }
        });

        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: "Subject already exists"
            });
        }

        const subject = await Subject.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: "Subject Created Successfully",
            subject
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// Get All Subjects
const getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.findAll();

        res.status(200).json({
            success: true,
            count: subjects.length,
            subjects
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
const updateSubject = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description } = req.body;

        // Find Subject
        const subject = await Subject.findByPk(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Update values
        subject.name = name;
        subject.description = description;

        await subject.save();

        res.status(200).json({
            success: true,
            message: "Subject Updated Successfully",
            subject
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const deleteSubject = async (req, res) => {
    try {

        const { id } = req.params;

        // Find Subject
        const subject = await Subject.findByPk(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Delete Subject
        await subject.destroy();

        res.status(200).json({
            success: true,
            message: "Subject Deleted Successfully"
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
    createSubject,
    getSubjects,
     updateSubject,
      deleteSubject,
};