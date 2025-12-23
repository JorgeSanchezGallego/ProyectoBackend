const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token")
const {deleteImgCloudinary} = require("../utils/cloudinary.utils")


const registerUser = async (req, res) => {
    try {
        const user = new User(req.body)
        const userExist = await User.findOne({ email: user.email})
        if (userExist){
            if (req.file) {
                deleteImgCloudinary(req.file.path);
            }
            return res.status(400).json("El usuario ya existe")
        }
        user.role = "user"
        if (req.file) {
            user.img = req.file.path;
        } else {
            return res.status(400).json("La imagen de perfil es obligatoria");
        }
        const userDB = await user.save()
        res.status(201).json(userDB)
    } catch (error) {
        res.status(400).json({error: "Error al registrar usuario", detalle: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword){
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const token = generateToken(user.id, user.email)
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


module.exports = {
    registerUser,
    loginUser,
    getUsers,
    deleteUser,
    updateUserRol
}
