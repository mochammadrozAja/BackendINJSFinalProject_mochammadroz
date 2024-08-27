'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookmarks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: {
            tableName: "Movies",
          },
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookmarks');
  }
};