const Resource = require("../models/Resource");

const createResource = async (data) => {
    return await Resource.create(data);
};

const getAllResources = async (filters = {}) => {
    const where = {};

    if (filters.subjectId) {
        where.subjectId = filters.subjectId;
    }

    if (filters.topicId) {
        where.topicId = filters.topicId;
    }

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.isPublished !== undefined) {
        where.isPublished = filters.isPublished;
    }

    return await Resource.findAll({
        where,
        order: [["createdAt", "DESC"]],
    });
};

const getResourceById = async (id) => {
    return await Resource.findByPk(id);
};

const updateResource = async (id, data) => {
    const resource = await Resource.findByPk(id);

    if (!resource) {
        return null;
    }

    await resource.update(data);

    return resource;
};

const deleteResource = async (id) => {
    const resource = await Resource.findByPk(id);

    if (!resource) {
        return false;
    }

    await resource.destroy();

    return true;
};

const publishResource = async (id, isPublished) => {
    const resource = await Resource.findByPk(id);

    if (!resource) {
        return null;
    }

    resource.isPublished = isPublished;

    await resource.save();

    return resource;
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
    publishResource,
};