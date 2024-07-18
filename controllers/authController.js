const { User } = require('../models');
const bcrypt = require('bcrypt');
const session = require('express-session');

class AuthController{
    static async home(req, res){
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }
    static async register(req, res){
        try {
            res.render('auth/regist')
        } catch (error) {
            res.send(error)
        }
    }
    static async saveUser(req, res){
        try {
            const { username, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ username, email, password:hashedPassword })
            // res.send(req.body)
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
    static async formLogin(req, res){
        try {
            res.render('auth/login')
        } catch (error) {
            res.send(error)
        }
    }
    static async login(req, res){
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    req.session.user = user; 
                    return res.redirect('/products');
                } else {
                    return res.send('Invalid email or password');
                }
            } else {
                return res.send('User not found');
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async logout(req, res){
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.send(err);
                }
                res.redirect('/');
            });
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = AuthController;