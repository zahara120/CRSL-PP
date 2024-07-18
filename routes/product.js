const ProductController = require('../controllers/productController');

const product = require('express').Router()

product.get('/', ProductController.showListProduct)

product.use(function (req, res, next) {
    res.locals.user = req.session.user
    if (req.session.user.role === 'admin') {
        next()
    } else {
        res.redirect('/products?error=anda bukan admin')
    }
})

product.get('/add', ProductController.addProduct)
product.post('/add', ProductController.saveProduct)
product.get('/:id/detail', ProductController.detailProduct)
product.get('/:id/edit', ProductController.editProduct)
product.post('/:id/edit', ProductController.updateProduct)
product.get('/:id/delete', ProductController.deleteProduct)

module.exports = product;