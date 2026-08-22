const {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
    publishResource,
} = require("../services/resource.service");

// --------------------------------
// CREATE RESOURCE
// --------------------------------

const createResourceController = async (req, res) => {
    try {
        const {
            title,
            description,
            subjectId,
            topicId,
            type,
            fileUrl,
            thumbnailUrl,
            isPublished,
        } = req.body;

        if (!title || !subjectId || !type) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, subjectId and type are required",
            });
        }

        const resource = await createResource({
            title,
            description,
            subjectId,
            topicId: topicId || null,
            type,
            fileUrl,
            thumbnailUrl,
            isPublished: isPublished ?? false,
        });

        return res.status(201).json({
            success: true,
            message: "Resource Created Successfully",
            resource,
        });
    } catch (error) {
        console.error(
            "Create Resource Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create resource",
        });
    }
};

// --------------------------------
// GET ALL RESOURCES
// --------------------------------

const getResourcesController = async (req, res) => {
    try {
        const {
            subjectId,
            topicId,
            type,
            isPublished,
        } = req.query;

        const filters = {};

if (req.user.role === "admin") {
    if (isPublished !== undefined) {
        filters.isPublished =
            isPublished === "true";
    }
} else {
    filters.isPublished = true;
}

if (subjectId) {
    filters.subjectId = subjectId;
}

if (topicId) {
    filters.topicId = topicId;
}

if (type) {
    filters.type = type;
}
        if (isPublished !== undefined) {
            filters.isPublished =
                isPublished === "true";
        }

        const resources =
            await getAllResources(filters);

        return res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        console.error(
            "Get Resources Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get resources",
        });
    }
};

// --------------------------------
// GET RESOURCE BY ID
// --------------------------------

const getResourceController = async (req, res) => {
    try {
        const { id } = req.params;

        const resource =
            await getResourceById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        return res.status(200).json({
            success: true,
            resource,
        });
    } catch (error) {
        console.error(
            "Get Resource Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get resource",
        });
    }
};

// --------------------------------
// UPDATE RESOURCE
// --------------------------------

const updateResourceController = async (req, res) => {
    try {
        const { id } = req.params;

        const resource =
            await updateResource(id, req.body);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resource Updated Successfully",
            resource,
        });
    } catch (error) {
        console.error(
            "Update Resource Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update resource",
        });
    }
};

// --------------------------------
// DELETE RESOURCE
// --------------------------------

const deleteResourceController = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted =
            await deleteResource(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Resource Deleted Successfully",
        });
    } catch (error) {
        console.error(
            "Delete Resource Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete resource",
        });
    }
};

// --------------------------------
// PUBLISH / UNPUBLISH RESOURCE
// --------------------------------

const publishResourceController =
    async (req, res) => {
        try {
            const { id } = req.params;
            const { isPublished } = req.body;

            if (typeof isPublished !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message:
                        "isPublished must be true or false",
                });
            }

            const resource =
                await publishResource(
                    id,
                    isPublished
                );

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: "Resource not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    isPublished
                        ? "Resource Published Successfully"
                        : "Resource Unpublished Successfully",
                resource,
            });
        } catch (error) {
            console.error(
                "Publish Resource Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update resource status",
            });
        }
    };

module.exports = {
    createResourceController,
    getResourcesController,
    getResourceController,
    updateResourceController,
    deleteResourceController,
    publishResourceController,
};