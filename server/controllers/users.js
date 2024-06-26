const userModel = require("../models/auth");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel
  .find({ _id: { $ne: req?.user?._id } })
  .select("-password")
  .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    const userDetails = await userModel.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User does not exist." });
    }

    userDetails.skills = skills;

    await userDetails.save();

    return res.status(200).json({
      message: "Skills updated successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDetails = await userModel.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User does not exist." });
    }

    userDetails.isActive = !userDetails.isActive;

    await userDetails.save();

    return res.status(200).json({
      message: "Status changed successfully.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
