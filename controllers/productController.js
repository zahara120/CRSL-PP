const { Op } = require('sequelize')
const { Product, Category } = require('../models')
const { formatCurrency } = require('../helpers/formatter')

class ProductController {
    static async showListProduct(req, res) {
        try {
            const { category, search, error } = req.query
            let data = await Product.getAllData(category, search)
            let categories = await Category.findAll()
            // res.send(data)
            res.render('listProduct', { data, categories, formatCurrency, error })
        } catch (error) {
            res.send(error)
        }
    }
    static async detailProduct(req, res) {
        try {
            const { errors } = req.query
            const { id } = req.params
            let data = await Product.findOne({
                where: {
                    id: id
                },
                include: Category
            })
            // res.send(data)
            res.render('detailProduct', { data, formatCurrency, errors })
        } catch (error) {
            res.send(error)
        }
    }
    static async addProduct(req, res) {
        try {
            const { errors } = req.query
            let data = await Category.findAll()
            // res.send(data)
            res.render('admin/addProduct', { data, errors })
        } catch (error) {
            res.send(error)
        }
    }
    static async saveProduct(req, res) {
        try {
            const { name, description, price, stock, imageUrl, CategoryId } = req.body
            await Product.create({ name, description, price, stock, imageUrl, CategoryId })
            // res.send(req.body)
            res.redirect('/products')
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                let errors = error.errors.map(el => el.message)
                res.redirect(`/products/add?errors=${errors}`)
            }else{
                res.send(error)
            }
        }
    }
    static async editProduct(req, res) {
        try {
            const { id } = req.params
            const { errors } = req.query
            let data = await Product.findByPk(id)
            let category = await Category.findAll()
            // res.send(data)
            res.render('admin/editProduct', { data, category, errors })
        } catch (error) {
            res.send(error)
        }
    }
    static async updateProduct(req, res) {
        const { id } = req.params
        try {
            const { name, description, price, stock, imageUrl, CategoryId } = req.body
            await Product.update(
                { name, description, price, stock, imageUrl, CategoryId }, 
                { where: { id: id }} 
            )
            // res.send(req.body)
            res.redirect('/products')
        } catch (error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                let errors = error.errors.map(el => el.message)
                res.redirect(`/products/${id}/edit?errors=${errors}`)
            }else{
                res.send(error)
            }
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