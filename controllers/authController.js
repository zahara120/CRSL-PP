const { User, Profile } = require('../models');
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
            const { errors } = req.query
            res.render('auth/regist', { errors })
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
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                let errors = error.errors.map(el => el.message)
                res.redirect(`/register?errors=${errors}`)
            }else{
                res.send(error)
            }
        }
    }
    static async formLogin(req, res){
        try {
            const { errors } = req.query
            res.render('auth/login', { errors })
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
                    return res.redirect(`/login?errors=password not valid`)
                }
            } else {
                return res.redirect(`/login?errors=user with email ${email} not found`)
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
    static async profile(req, res){
        try {
            let data = await Profile.findOne({ where: { UserId: req.app.locals.user.id } })
            let msg = ''
            if(!data) {
                msg = 'please complete your profile'
            }
            res.render('profile', {data, msg})
        } catch (error) {
            res.send(error)
        }
    }
    static async saveProfile(req, res){
        try {
            const { gender, birthOfDate, address, phone } = req.body
            const UserId = req.app.locals.user.id;
            await Profile.create({ gender, birthOfDate, address, phone, UserId })
            // res.send(req.body)
            res.redirect('/profile')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = AuthController;