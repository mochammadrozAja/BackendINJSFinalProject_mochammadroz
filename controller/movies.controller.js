const { Movie } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
}