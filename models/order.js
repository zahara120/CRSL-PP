'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Product, { through: models.OrderProduct })
    }
    static async getTotalPrice(id) {
      let order = await Order.findByPk(id, {
        include: {
          model: sequelize.models.Product
        }
      })
      // console.log(order);
      const totalPrice = order.Products.reduce((sum, product) => sum + product.price, 0);
      return totalPrice;
    }
  }
  Order.init({
    UserId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER
  }, {
    hooks: {
      // beforeCreate: (Order) => {
        
      // },
    },
    sequelize,
    modelName: 'Order',
  });
  return Order;
};