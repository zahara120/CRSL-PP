const ProductController = require('../controllers/productController');

const product = require('express').Router()

product.get('/', ProductController.showListProduct)
product.get('/:id', ProductController.detailProduct)

module.exports = product;