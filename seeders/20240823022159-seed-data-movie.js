'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = require("../data/data.json").map((el) => {
      el.createdAt = el. updatedAt = new Date();
      return el;
    });
    // console.log(data);

    await queryInterface.bulkInsert("Movies",data);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Movies', null, {
      truncate:true,
      restartIdentity:true,
      cascade:true,
    });
  }
};
