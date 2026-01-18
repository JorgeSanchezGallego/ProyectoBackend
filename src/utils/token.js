const jwt = require("jsonwebtoken") //Firma datos con una clabe secreta

const generateToken = (id, email) => { //Funcion para cuando el usuario introduce su email y contraseña correctas
    return jwt.sign(
        {id, email}, //Guardamos id y email para saber que usuario es
        process.env.JWT_SECRET, //Firma unica del servidor
        {expiresIn: "1d"} //Solo estara disponible la sesion durante un dia
    )
}

const verifyToken = (token) => { //Funcion para comprobar si un token es valido
    return jwt.verify(token, process.env.JWT_SECRET)//Comprueba que no ha caducado, que la firma coincide con JWTSecret, si todo va bien devuelve el objeto original
}

module.exports = {generateToken, verifyToken};