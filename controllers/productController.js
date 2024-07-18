const { Op } = require('sequelize')
const { Product, Category } = require('../models')
const { formatCurrency } = require('../helpers/formatter')

class ProductController {
    static async showListProduct(req, res) {
        try {
            const { category } = req.query
            let data = await Product.getAllData(category)
            let categories = await Category.findAll()
            // res.send(data)
            res.render('listProduct', { data, categories, formatCurrency })
        } catch (error) {
            res.send(error)
        }
    }
    static async detailProduct(req, res) {
        try {
            const { id } = req.params
            let data = await Product.findOne({
                where: {
                    id: id
                },
                include: Category
            })
            // res.send(data)
            res.render('detailProduct', { data })
        } catch (error) {
            res.send(error)
        }
    }
    static async addProduct(req, res) {
        try {
            let data = await Category.findAll()
            // res.send(data)
            res.render('admin/addProduct', { data })
        } catch (error) {
            res.send(error)
        }
    }
    static async saveProduct(req, res) {
        try {
            const { name, description, price, stock, CategoryId } = req.body
            await Product.create({ name, description, price, stock, CategoryId })
            // res.send(req.body)
            res.redirect('/products')
        } catch (error) {
            res.send(error)
        }
    }
    static async editProduct(req, res) {
        try {
            const { id } = req.params
            let data = await Product.findByPk(id)
            let category = await Category.findAll()
            // res.send(data)
            res.render('admin/editProduct', { data, category })
        } catch (error) {
            res.send(error)
        }
    }
    static async updateProduct(req, res) {
        try {
            const { id } = req.params
            const { name, description, price, stock, CategoryId } = req.body
            await Product.update(
                { name, description, price, stock, CategoryId }, 
                { where: { id: id }} 
            )
            // res.send(req.body)
            res.redirect('/products')
        } catch (error) {
            res.send(error)
        }
    }
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params
            await Product.destroy({ where: { id: id } })
            res.redirect('/products')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = ProductController;