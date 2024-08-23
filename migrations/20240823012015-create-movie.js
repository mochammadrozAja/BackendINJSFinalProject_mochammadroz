'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      synopsis: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      trailerUrl: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      rating: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Movies');
  }
};