const { Bookmark, Movie, User } = require("../models");

exports.index = async (req, res, next) => {
  const reqUserId = JSON.parse(atob(req.headers.authorization.split(" ")[1].split(".")[1])).id;

  const options = {
    include: ["movie"],
  };

  if (reqUserId) {
    options.where = {
      userId: reqUserId,
    };
  }

  try {
    const bookmarks = await Bookmark.findAll(options);
    res.status(200).json(bookmarks);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { id } = req.params;
  const reqUserId = JSON.parse(atob(req.headers.authorization.split(" ")[1].split(".")[1])).id;
  
  try {
    const movie = await Movie.findOne({
      where: { id },
    });

    const bookmark = await Bookmark.create({movieId: id,userId: reqUserId});
    res.status(201).json({message: "success adding new bookmark",
      id:bookmark.id,userId:bookmark.userId,movieId:bookmark.movieId,movie:movie.title
    });
  } catch (error) {
    if(error.message=="Validation error") {
      return res.status(200).json({
        message: 'bookmark already exists'
      });
    }
    next(error);
    // console.log(error.message,"ardian error");
  }
};
