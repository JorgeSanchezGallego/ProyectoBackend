const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token")
const {deleteImgCloudinary} = require("../utils/cloudinary.utils")


const registerUser = async (req, res) => {
    try {
        const user = new User(req.body) //Creamos instancia del modelo recibido 
        const userExist = await User.findOne({ email: user.email}) //Comprobacion manual de duplicados, aunque con email unique ya lo estemos haciendo
        if (userExist){
            if (req.file) {
                deleteImgCloudinary(req.file.path); //Si existe, borramos la foto que haya subido
            }
            return res.status(400).json("El usuario ya existe")
        }
        if(user.videogames && user.videogames.length > 0) { //Verificamos que en la peticion viene el campo videogames, y si trae al menos un elemento... si no lo saltamos
            user.videogames = [...new Set(user.videogames.map(id => id.toString()))] //Eliminamos posibles videojuegos duplicados y pasamos el id a string por que a veces viene como objectId y tranformamos el set de vuelta a array
        }
        user.role = "user" //Forzamos por seguridad que el role sea user
        if (req.file) { //Gestion de la imagen subida por multer
            user.img = req.file.path;
        } else {
            return res.status(400).json("La imagen de perfil es obligatoria");
        }
        const userDB = await user.save() //Aqui salta el pre-save
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({error: "Error al registrar usuario", detalle: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email}) //Busca el usuario por email
        if(!user){
            return res.status(400).json("Contraseña o usuario incorrecto") //Por seguridad no decimos si lo que falla es el email o la password
        }
        const validPassword = bcrypt.compareSync(password, user.password) //Compara la contraseña en texto plano con la encriptada
        if (!validPassword){
            return res.status(400).json("Contraseña o usuario incorrecto") //Gestion de errores
        }
        const token = generateToken(user.id, user.email) //Genera el token para auth diferentes peticiones
        return res.status(200).json({token, user})
    } catch (error) {
        return res.status(400).json("Error al login")
    }
}

const getUsers = async (req,res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json("Error")
    }
}



const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const userLogueado = req.user; 

        if (userLogueado._id.toString() === id || userLogueado.role === "admin") {
            
            const userDeleted = await User.findByIdAndDelete(id);

            if (!userDeleted) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }
            if (userDeleted.img) {
                deleteImgCloudinary(userDeleted.img);
            }
            return res.status(200).json({
                mensaje: "Usuario eliminado correctamente",
                usuarioBorrado: userDeleted.email
            });

        } else {
            
            return res.status(403).json({ 
                mensaje: "No tienes permisos para eliminar esta cuenta. Solo puedes borrar la tuya propia o ser administrador." 
            });
        }

    } catch (error) {
        return res.status(500).json({ 
            mensaje: "Error al eliminar el usuario", 
            error: error.message 
        });
    }
};

const updateUserRol = async (req, res) => {
    try{    
        const { id } = req.params
        const { role} = req.body
        if(req.user.role !== "admin") {
            return res.status(403).json("Acceso denegado")
        }
        if(!["admin", "user"].includes(role)) {
            return res.status(400).json("Rol no válido")
        }
        const userUpdated = await User.findByIdAndUpdate(id, {role: role}, {new: true}).select("-password")
        if (!userUpdated) {
            return res.status(404).json("Usuario no encontrado");
        }
        return res.status(200).json("Rol actualizado")
} catch (error) {
    return res.status(500).json({ error: "Error al actualizar rol", detalle: error.message})
}
}




const addGameToUser = async (req, res) => {
    try {
        const { videogames } = req.body
        const userId = req.user._id
        const userUpdated = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { videogames: videogames}}, {new: true}
        ).populate("videogames")
        if (!userUpdated){
            return res.status(404).json("Usuario no encontrado")
        }
        return res.status(200).json({mensaje: "Videojuego añadido", usuario: userUpdated})
    } catch (error) {
        return res.status(500).json({error: "Error al añadir el juego", detalle: error.message})
    }
}


const deleteGameToUser = async (req, res) => {
    try {
        const { videogames } = req.body
        const userId = req.user._id
        const userUpdated = await User.findByIdAndUpdate(
            userId,
            { $pull: { videogames: videogames}}, {new: true}
        ).populate("videogames")
        if (!userUpdated){
            return res.status(404).json("Usuario no encontrado")
        }
        return res.status(200).json({mensaje: "Videojuego borrado", usuario: userUpdated})
    } catch (error) {
        return res.status(500).json({error: "Error al borrar el juego", detalle: error.message})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    deleteUser,
    updateUserRol,
    addGameToUser,
    deleteGameToUser
}
