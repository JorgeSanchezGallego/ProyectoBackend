const mongoose = require("mongoose")
const User = require("../models/user.model")
const Videogame = require("../models/videogame.model")
const bcrypt = require("bcrypt")
const users = require("../data/users")
require("dotenv").config()



const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Cargando usuarios");
        await User.collection.drop()
        const userWithHash = users.map((user) => ({
            ...user, 
            password: bcrypt.hashSync(user.password, 10)
        }))
        await User.insertMany(userWithHash)
        console.log("Usuarios cargados correctamente");
    } catch (error) {
        console.log("Error en la semilla de usuarios", error);
    } finally {
        await mongoose.disconnect()
    }
}

seedUsers();