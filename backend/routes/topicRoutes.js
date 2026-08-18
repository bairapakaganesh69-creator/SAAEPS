const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createTopic,
    getTopics,
    getTopicsBySubject,
    updateTopic,
    deleteTopic,
} = require("../controllers/topicController");

// --------------------------------
// CREATE TOPIC - ADMIN
// --------------------------------

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createTopic
);

// --------------------------------
// GET ALL TOPICS
// --------------------------------

router.get(
    "/",
    getTopics
);

// --------------------------------
// GET TOPICS BY SUBJECT
// --------------------------------

router.get(
    "/:subjectId",
    getTopicsBySubject
);

// --------------------------------
// UPDATE TOPIC - ADMIN
// --------------------------------

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateTopic
);

// --------------------------------
// DELETE TOPIC - ADMIN
// --------------------------------

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteTopic
);

module.exports = router;