const OrderController = require('../controllers/orderController');
const order = require('express').Router()

order.get('/', OrderController.listOrder)
order.get('/history', OrderController.showHistory)
order.post('/:productId', OrderController.buy)
order.get('/:orderId/checkout', OrderController.checkout)
order.get('/:orderId/delete', OrderController.deleteOrder)
order.get('/:orderId/generateInvoice', OrderController.generateInvoice)

module.exports = order;