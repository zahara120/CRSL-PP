const ProductController = require('../controllers/productController');

const product = require('express').Router()

product.get('/', ProductController.showListProduct)
product.get('/add', ProductController.addProduct)
product.post('/add', ProductController.saveProduct)
product.get('/:id/detail', ProductController.detailProduct)

module.exports = product;