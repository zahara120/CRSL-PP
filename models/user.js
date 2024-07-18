'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Order)
    }
    static async findPendingOrder(UserId) {
      return await User.findByPk(UserId, {
        include: {
          model: sequelize.models.Order,
          where: { status: 'pending' },
        }
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'username is required'
        },
        notEmpty: {
          msg: 'username is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'email is required'
        },
        notEmpty: {
          msg: 'email is required'
        },
        isEmail: {
          args: true,
          msg: 'email is not valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required'
        },
        notEmpty: {
          msg: 'password is required'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};