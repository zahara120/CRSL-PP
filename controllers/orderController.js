const { formatCurrency } = require('../helpers/formatter');
const { Product, Category, Order, OrderProduct, User } = require('../models');

class OrderController {
    static async listOrder(req, res) {
        try {
            const UserId = req.session.userId;
            const data = await Order.findOne({
                where: { status: 'pending', UserId: UserId },
                include:
                {
                    model: Product
                },
            });
            let totalPrice = 0;
            if(data){
                totalPrice = await Order.getTotalPrice(data.id);
            }
            // res.send(data)
            res.render('listOrder', { data, totalPrice, formatCurrency });
        } catch (error) {
            res.send(error);
        }
    }
    static async buy(req, res) {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const UserId = req.session.userId;

            // Check user udah punya order atau belum
            const user = await User.findByPk(UserId, {
                include: {
                    model: Order,
                    where: { status: 'pending' },
                }
            });

            // Ambil harga produk dari database
            const product = await Product.findByPk(productId);

            // Jika user belum pernah order, buat order baru
            if (!user || user.Orders.length === 0) {
                const order = await Order.create({ UserId });
                await OrderProduct.create({
                    OrderId: order.id,
                    ProductId: productId,
                    price: product.price,
                    quantity: quantity,
                });
            } else {
                // Jika user sudah pernah order
                const order = user.Orders[0];
                await OrderProduct.create({
                    OrderId: order.id,
                    ProductId: productId,
                    price: product.price,
                    quantity: quantity,
                });
            }

            res.redirect('/orders');
        } catch (error) {
            res.send(error);
        }
    }
    static async checkout(req, res) {
        try {
            const { orderId } = req.params;
            const totalPrice = await Order.getTotalPrice(orderId);
            await Order.update(
                {
                    totalPrice: totalPrice,
                    status: 'paid'
                },
                {
                    where: {
                        id: orderId,
                    }
                }
            );
            res.redirect('/orders');
            // res.send(totalPrice)
            // console.log(totalPrice);
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = OrderController;
