const videogames = require("../data/videogames")
const Videogame = require("../models/videogame.model")
const mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.DB_URL)
    .then(async () => {
        const allVideogames = await Videogame.find()
        if(allVideogames.length){
            await Videogame.collection.drop()
        }
    })
    .catch((error) => console.log(`Error deleting data: ${error}`))
    .then(async () => {
        await Videogame.insertMany(videogames)
    })
    .catch((error) => console.log(`Error creating data ${error}`))
    .finally(() => mongoose.disconnect())