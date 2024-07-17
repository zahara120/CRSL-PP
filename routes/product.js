const ProductController = require('../controllers/productController');

const product = require('express').Router()

product.get('/', ProductController.showListProduct)

module.exports = product;