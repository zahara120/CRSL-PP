const express = require('express')
const app = express()
const port = 3000
const auth = require('./routes/auth')

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('ini home')
})
app.use('/', auth)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})