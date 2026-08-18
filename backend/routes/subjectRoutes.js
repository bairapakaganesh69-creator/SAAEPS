const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject,
} = require("../controllers/subjectController");

// --------------------------------
// CREATE SUBJECT - ADMIN
// --------------------------------

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createSubject
);

// --------------------------------
// GET ALL SUBJECTS
// --------------------------------

router.get(
    "/",
    getSubjects
);

// --------------------------------
// UPDATE SUBJECT - ADMIN
// --------------------------------

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateSubject
);

// --------------------------------
// DELETE SUBJECT - ADMIN
// --------------------------------

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSubject
);

module.exports = router;