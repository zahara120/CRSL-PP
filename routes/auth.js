const auth = require('express').Router()
const AuthController = require('../controllers/authController');

auth.get('/register', AuthController.register)
auth.get('/login', AuthController.login)
auth.get('/logout', AuthController.logout)

module.exports = auth;