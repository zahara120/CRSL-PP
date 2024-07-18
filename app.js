const express = require('express')
const app = express()
const port = 3000
const auth = require('./routes/auth')
const product = require('./routes/product')
const order = require('./routes/order')
const session = require('express-session');
const AuthController = require('./controllers/authController')

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'something',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: true }
}));
app.set('view engine', 'ejs')

app.get('/', AuthController.home)

app.use('/', auth)

app.use(function(req, res, next) {
  app.locals = {
    user: req.session.user,
  }
  next()
})

app.use(function(req, res, next) {
  console.log(app.locals, '<<<<< locals');
  app.locals.user = req.session.user
  if(req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.use('/products', product)
app.use('/orders', order)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})