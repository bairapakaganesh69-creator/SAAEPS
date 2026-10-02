const User = require("../../models/User");


const getStudentContext = async (studentId) => {

    try {

        if (!studentId) {
            return {
                message: "Student ID not available",
                source: "default"
            };
        }


        const student = await User.findByPk(studentId, {
            attributes: [
                "id",
                "fullName",
                "email",
                "role"
            ]
        });


        if (!student) {
            return {
                message: "Student not found",
                source: "default"
            };
        }


        return {
            studentId: student.id,
            studentName: student.fullName,
            email: student.email,
            role: student.role,
            source: "database"
        };


    } catch (error) {

        console.error(
            "Student Context Error:",
            error
        );


        return {
            message: "Unable to fetch student data",
            source: "error"
        };

    }

};


module.exports = {
    getStudentContext
};