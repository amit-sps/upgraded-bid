const Resource = require("../models/resource");
const logger = require("../utils/winston.util");
const { validationResult } = require("express-validator");

exports.addResource = async (req, res) => {
  try {
    const { title, link, coverImage, description } = req.body;
    const postedBy = req?.user?._id;
    const resource = new Resource({
      title,
      link,
      coverImage,
      description,
      postedBy,
    });
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: "Internal server error." });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({}).populate({
      path: "postedBy",
      select: "name",
    });
    return res
      .status(200)
      .json({ message: "Resources found successfully.", data: resources });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ postedBy: req.user._id }).populate({
      path: "postedBy",
      select: "name",
    });
    return res
      .status(200)
      .json({ message: "Resources found successfully.", data: resources });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateResource = async (req, res) => {
  const resourceId = req.params.id;
  const { title, link, coverImage, description } = req.body;

  try {
    const resourceToUpdate = await Resource.findById(resourceId).lean();
    if (!resourceToUpdate) {
      return res.status(404).json({ message: "Resource not found." });
    }

    if (resourceToUpdate.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You are not allowed to update this resource.",
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { title, link, coverImage, description, postedBy: req.user._id },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    return res.status(200).json({
      message: "Resource updated successfully.",
      data: updatedResource,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getResourceById = async (req, res) => {
  const resourceId = req.params.id;

  try {
    const resourceDetails = await Resource.findOne({
      _id: resourceId,
      postedBy: req.user._id,
    })
      .populate({
        path: "postedBy",
        select: "name",
      })
      .lean();
    if (!resourceDetails) {
      return res.status(404).json({ message: "Resource not found." });
    }

    return res.status(200).json({
      message: "Resource found successfully.",
      data: resourceDetails,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteResourceById = async (req, res) => {
  const resourceId = req.params.id;

  try {
    const resourceDetails = await Resource.findOneAndDelete({
      _id: resourceId,
      postedBy: req.user._id,
    });

    if (!resourceDetails) {
      return res.status(404).json({ message: "Resource not found." });
    }

    return res.status(200).json({
      message: "Resource deleted successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
