const { Product, Category } = require('../models')
class ProductController{
    static async showListProduct(req, res){
        try {
            let data = await Product.findAll({
                include: Category
            })
            // res.send(data)
            res.render('listProduct', {data})
        } catch (error) {
            res.send(error)
        }
    }
    static async detailProduct(req, res){
        try {
            const { id } = req.params
            let data = await Product.findOne({
                where:{
                    id:id
                },
                include: Category
            })
            // res.send(data)
            res.render('detailProduct', {data})
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = ProductController;