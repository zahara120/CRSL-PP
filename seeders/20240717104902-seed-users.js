'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const bcrypt = require('bcrypt');
    let data = await Promise.all(require('../data/user.json').map(async (el) => {
      const hashedPassword = await bcrypt.hash(el.password, 10);
      return {
        ...el,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }));
    await queryInterface.bulkInsert('Users', data);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
