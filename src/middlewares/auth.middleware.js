const User = require("../models/user.model")
const { verifyToken } = require("../utils/token")

const isAuth = async (req, res, next) => {
        try {
            const [, token] = req.headers.authorization.split(" ")//Buscamos el token en las cabeceras, formato esperado Bearer. Hacemos split para separar el bearer del token real
            if (!token) { //Capturamos un error
                return res.status(401).json("No autorizado, token no proporcionado")
            }
            const { id } = verifyToken(token) // Verificamos que el token es valido y obtenemos el ID 
            const user = await User.findById(id) //Buscamos al usuario para asegurarnos que existe
            if (!user){ //Capturamos error si no existe
                return res.status(401).json("Token o usuario invalidos")
            }
            req.user = user //Inyectamos el usuario en la peticion
            next();
        } catch (err) {
            return res.status(401).json("Token invalido o sesion expirada")
        }
    }

const isAdmin = async (req, res, next) => { //Comprobacion para dejar paso solo a los admins
    try {
        if (req.user && req.user.role === "admin"){
            return next();
        } else {
            return res.status(403).json("Acceso denegado")
        }
    } catch (error) {
        return res.status(403).json("Error de permisos")
    }
}


module.exports = {isAuth, isAdmin}