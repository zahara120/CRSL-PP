const { formatCurrency } = require('../helpers/formatter');
const { Product, Order, OrderProduct, User } = require('../models');
const easyinvoice = require('easyinvoice');

class OrderController {
    static async listOrder(req, res) {
        try {
            const UserId = req.app.locals.user.id;
            const data = await Order.findOne({
                where: { status: 'pending', UserId: UserId },
                include:
                {
                    model: Product
                },
            });
            let totalPrice = 0;
            if (data) {
                totalPrice = await Order.getTotalPrice(data.id);
            }
            // res.send(data)
            // console.log(data.Products.OrderProduct);
            res.render('listOrder', { data, totalPrice, formatCurrency });
        } catch (error) {
            res.send(error);
        }
    }
    static async showHistory(req, res) {
        try {
            const UserId = req.app.locals.user.id;
            const data = await Order.findAll({
                where: { status: 'paid', UserId: UserId },
                order: [['createdAt', 'DESC']],
                include:
                {
                    model: Product
                },
            });
            res.render('history', { data, formatCurrency });
        } catch (error) {
            res.send(error);
        }
    }
    static async buy(req, res) {
        const { productId } = req.params;
        try {
            const { quantity } = req.body;
            const UserId = req.app.locals.user.id;

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

            //kurangin stock
            await Product.update(
                { stock: product.stock - quantity },
                { where: { id: productId } }
            );

            res.redirect('/orders');
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(el => el.message)
                res.redirect(`/products/${productId}/detail?errors=${errors}`)
            } else {
                res.send(error)
            }
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
    static async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            await Order.destroy(
                {
                    where: {
                        id: orderId,
                    }
                }
            );
            res.redirect('/orders');
        } catch (error) {
            res.send(error);
        }
    }
    static async generateInvoice(req, res) {
        try {
            const { orderId } = req.params;
            const order = await Order.findByPk(orderId, {
                include: [
                    { model: Product }, 
                    { model: User }     
                ]
            });

            if (!order) {
                return res.send('Order not found');
            }

            const invoiceData = {
                "documentTitle": "INVOICE",
                "currency": "USD",
                "taxNotation": "vat",
                "marginTop": 25,
                "marginRight": 25,
                "marginLeft": 25,
                "marginBottom": 25,
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                "sender": {
                    "company": "Zahara's Production",
                    "address": "123 Main St",
                    "zip": "45678",
                    "city": "Jakarta",
                    "country": "Indonesia"
                },
                "client": {
                    "company": order.User.username,
                    "address": "123 Main St",
                    "zip": "45678",
                    "city": "Jakarta",
                    "country": "Indonesia"
                },
                
                "invoiceNumber": order.id,
                "invoiceDate": new Date().toISOString().slice(0, 10),
                "products": order.Products.map(item => ({
                    "quantity": item.OrderProduct.quantity,
                    "description": item.name,
                    "price": item.price
                })),
                "bottomNotice": "Thank you for your business.",
            };

            // Generate the invoice PDF
            easyinvoice.createInvoice(invoiceData, function (result) {
                const pdfBase64 = result.pdf;
                const buffer = Buffer.from(pdfBase64, 'base64');
                res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
                res.setHeader('Content-Type', 'application/pdf');
                res.send(buffer);
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = OrderController;
