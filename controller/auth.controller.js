const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      message: "Success creating new user",
      user,
    });
  } catch (error) {
    next(error);
  }
}