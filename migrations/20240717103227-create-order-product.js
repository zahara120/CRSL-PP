'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Orders'
        },
        allowNull: false,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Products'
        },
        allowNull: false,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      price: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue:1
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
    await queryInterface.dropTable('OrderProducts');
  }
};