const { Bookmark, Movie, User } = require("../models");

const getUserIdFromToken = (token) => {
  try {
    return JSON.parse(atob(token.split(" ")[1].split(".")[1])).id;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

exports.index = async (req, res, next) => {
  const reqUserId = getUserIdFromToken(req.headers.authorization);

  const options = {
    include: ["movie"],
    where: reqUserId ? { userId: reqUserId } : {},
  };

  try {
    const bookmarks = await Bookmark.findAll(options);
    res.status(200).json(bookmarks);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { id } = req.params;
  const reqUserId = getUserIdFromToken(req.headers.authorization);

  try {
    const movie = await Movie.findOne({ where: { id } });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const [bookmark, created] = await Bookmark.findOrCreate({
      where: { movieId: id, userId: reqUserId },
      defaults: { movieId: id, userId: reqUserId },
    });

    if (!created) {
      return res.status(200).json({
        message: "Bookmark already exists",
        id: bookmark.id,
        userId: bookmark.userId,
        movieId: bookmark.movieId,
        movie: movie.title,
      });
    }

    res.status(201).json({
      message: "Success adding new bookmark",
      id: bookmark.id,
      userId: bookmark.userId,
      movieId: bookmark.movieId,
      movie: movie.title,
    });
  } catch (error) {
    next(error);
  }
};