const { Bookmark, Movie, User } = require("../models");

exports.index = async (req, res, next) => {
  const userId = req.user.id;

  const options = {
    include: ["movie"],
    where: { userId },
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
  const userId = req.user.id;

  try {
    const movie = await Movie.findOne({ where: { id } });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const [bookmark, created] = await Bookmark.findOrCreate({
      where: { movieId: id, userId },
    });

    if (!created) {
      return res.status(409).json({
        message: "Bookmark already exists",
        data: {
          id: bookmark.id,
          userId: bookmark.userId,
          movieId: bookmark.movieId,
          movie: movie.title,
        }
      });
    }

    res.status(201).json({
      message: "Success adding new bookmark",
      data: {
        id: bookmark.id,
        userId: bookmark.userId,
        movieId: bookmark.movieId,
        movie: movie.title,
      }
    });
  } catch (error) {
    next(error);
  }
};