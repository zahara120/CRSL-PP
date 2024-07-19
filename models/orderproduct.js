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
    static async addProduct(orderId, productId, price, quantity) {
      // return await OrderProduct.create({
      //   OrderId: orderId,
      //   ProductId: productId,
      //   price: price,
      //   quantity: quantity,
      // });
      const Product = sequelize.models.Product;
      const product = await Product.findByPk(productId);

      if (quantity > product.stock) {
        throw new Error('Quantity exceeds stock available');
      }

      return await OrderProduct.create({
        OrderId: orderId,
        ProductId: productId,
        price: price,
        quantity: quantity,
      });
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