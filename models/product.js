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
    static async updateStock(productId, quantity) {
      const product = await Product.findByPk(productId);
      if (product) {
        Product.update(
          { stock: product.stock - quantity },
          { where: { id: productId } }
        )
      }
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required'
        },
        notEmpty: {
          msg: 'name is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description is required'
        },
        notEmpty: {
          msg: 'description is required'
        },
        isValid(value) {
          if (value.split(' ').length < 5) {
            throw new Error('description must be at least 5 characters')
          }
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'price is required'
        },
        notEmpty: {
          msg: 'price is required'
        },
        min: {
          args: 100000,
          msg: 'price must be greater than 100000'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'stock is required'
        },
        notEmpty: {
          msg: 'stock is required'
        },
        min: {
          args: 1,
          msg: 'stock must be greater than 0'
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'imageUrl is required'
        },
        notEmpty: {
          msg: 'imageUrl is required'
        },
        isUrl: {
          args: true,
          msg: 'imageUrl must be a valid url'
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'CategoryId is required'
        },
        notEmpty: {
          msg: 'CategoryId is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};