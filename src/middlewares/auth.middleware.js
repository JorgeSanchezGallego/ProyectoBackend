const User = require("../models/user.model")
const { verifyToken } = require("../utils/token")

const isAuth = async (req, res, next) => {
        try {
            const [, token] = req.headers.authorization.split(" ")
            if (!token) {
                return res.status(401).json("No autorizado, token no proporcionado")
            }
            const { id } = verifyToken(token)
            const user = await User.findById(id)
            if (!user){
                return res.status(401).json("Token o usuario invalidos")
            }
            req.user = user
            next();
        } catch (err) {
            return res.status(401).json("Token invalido o sesion expirada")
        }
    }

const isAdmin = async (req, res, next) => {
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