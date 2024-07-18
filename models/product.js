'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.belongsToMany(models.Order, { through: models.OrderProduct })
    }
    static getAllData(category, search) {
      let query = {
        where: {
          stock: {
            [Op.gt]: 0
          }
        },
        include: sequelize.models.Category
      }
      if (category) {
        query.where.CategoryId = category;
      }
      if (search) {
        query.where.name = {
          [Op.iLike]: `%${search}%`
        }
      }

      return Product.findAll(query)
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};