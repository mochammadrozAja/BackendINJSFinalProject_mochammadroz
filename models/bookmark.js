'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.Movie, {
        foreignKey: "movieId",
        as: "movie",
      });

      Bookmark.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Bookmark.init({
    movieId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bookmark',
  });
  return Bookmark;
};