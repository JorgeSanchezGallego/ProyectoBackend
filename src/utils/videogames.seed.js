const videogames = require("../data/videogames")
const Videogame = require("../models/videogame.model")
const mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.DB_URL) //Conectamos con la BBDD, devuelve promesa
    .then(async () => { //Si conectamos, entonces buscamos si hay videojuegos
        const allVideogames = await Videogame.find()
        if(allVideogames.length){//Si hay videojuegos, borramos
            await Videogame.collection.drop()
        }
    })
    .catch((error) => console.log(`Error deleting data: ${error}`))
    .then(async () => { //Cargamos masivamente los videojuegos
        await Videogame.insertMany(videogames)
    })
    .catch((error) => console.log(`Error creating data ${error}`))
    .finally(() => mongoose.disconnect())//Desconectamos