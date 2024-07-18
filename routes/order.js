const OrderController = require('../controllers/orderController');
const order = require('express').Router()

order.get('/', OrderController.listOrder)
order.post('/:productId', OrderController.buy)
order.get('/:orderId/checkout', OrderController.checkout)
order.get('/:orderId/delete', OrderController.deleteOrder)

module.exports = order;