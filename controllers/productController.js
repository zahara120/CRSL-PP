class ProductController{
    static showListProduct(req, res){
        try {
            res.render('listProduct')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = ProductController;