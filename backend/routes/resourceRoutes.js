const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createResourceController,
    getResourcesController,
    getResourceController,
    updateResourceController,
    deleteResourceController,
    publishResourceController,
} = require("../controllers/resourceController");

// --------------------------------
// STUDENT / AUTHENTICATED USER
// --------------------------------

// Get all resources
router.get(
    "/",
    authMiddleware,
    getResourcesController
);

// Get resource by ID
router.get(
    "/:id",
    authMiddleware,
    getResourceController
);

// --------------------------------
// ADMIN RESOURCE MANAGEMENT
// --------------------------------

// Create resource
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createResourceController
);

// Update resource
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateResourceController
);

// Delete resource
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteResourceController
);

// Publish / Unpublish resource
router.patch(
    "/:id/publish",
    authMiddleware,
    roleMiddleware("admin"),
    publishResourceController
);

module.exports = router;