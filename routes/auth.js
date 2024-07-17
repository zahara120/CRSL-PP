const auth = require('express').Router()
const AuthController = require('../controllers/authController');

auth.get('/register', AuthController.register)
auth.post('/register', AuthController.saveUser)
auth.get('/login', AuthController.formLogin)
auth.post('/login', AuthController.login)
auth.get('/logout', AuthController.logout)

module.exports = auth;