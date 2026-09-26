const express = require("express");
const router = express.Router();

const {
    getFaculty,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty
} = require("../controllers/facultyController");

router.get("/", getFaculty);
router.get("/:id", getFacultyById);
router.post("/", createFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

module.exports = router;