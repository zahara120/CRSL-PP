class AuthController{
    static register(req, res){
        try {
            res.send('regist')
        } catch (error) {
            res.send(error)
        }
    }
    static login(req, res){
        try {
           res.send('login') 
        } catch (error) {
            res.send(error)
        }
    }
    static logout(req, res){
        try {
           res.send('logout') 
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = AuthController;