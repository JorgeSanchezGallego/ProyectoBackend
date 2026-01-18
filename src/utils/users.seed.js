const mongoose = require("mongoose")
const User = require("../models/user.model")
const Videogame = require("../models/videogame.model")
const bcrypt = require("bcrypt")
const users = require("../data/users")
require("dotenv").config()



const seedUsers = async () => { //Funcion semilla
    try {
        await mongoose.connect(process.env.DB_URL) //Conectamos a la BBDD
        console.log("Cargando usuarios");
        await User.collection.drop() //Vaciamos la lista de usuarios
        const userWithHash = users.map((user) => ({ //Tenemos que encriptar las contraseñas a mano por que el pre-save no se ejecuta con insertmany
            ...user, 
            password: bcrypt.hashSync(user.password, 10)
        }))
        await User.insertMany(userWithHash) //Guardamos todos los usuarios nuevos
        console.log("Usuarios cargados correctamente");
    } catch (error) {
        console.log("Error en la semilla de usuarios", error);
    } finally {
        await mongoose.disconnect() //Como esto se ejecuta y muere, tenemos que cerrar
    }
}

seedUsers();