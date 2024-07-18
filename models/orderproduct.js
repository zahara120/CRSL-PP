'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderProduct.init({
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (orderProduct) => {
        orderProduct.price = orderProduct.price * orderProduct.quantity;
      },
    },
    sequelize,
    modelName: 'OrderProduct',
  });
  return OrderProduct;
};