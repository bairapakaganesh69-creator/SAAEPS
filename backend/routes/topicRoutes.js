const express = require("express");

const router = express.Router();

const {
    createTopic,
    getTopics,
    getTopicsBySubject,
   updateTopic,
   deleteTopic
} = require("../controllers/topicController");

router.post("/", createTopic);

router.get("/", getTopics);

router.get("/:subjectId", getTopicsBySubject);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;