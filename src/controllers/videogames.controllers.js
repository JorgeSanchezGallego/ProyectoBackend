const Videogame = require("../models/videogame.model")

const getVideogames = async (req, res) => {
    try {
        const videogames = await Videogame.find();
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los videojuegos ❌"})
    }
}


const getVideogamesById = async (req, res) => {
    try {
        const videogame = await Videogame.findById(req.params.id)
        if (!videogame){
            return res.status(404).json({error: "Videojuego no encontrado"})
        }
        res.status(200).json(videogame)
    } catch (error) {
        res.status(400).json({error: "ID inválido o error en la búsqueda"})
    }
}


const createVideogame = async (req, res) => {
    try {
        const videogame = await Videogame.create(req.body)
        res.status(200).json(videogame)
    } catch (error) {
        res.status(404).json({error: "Error al crear el videojuego", detalles: error.message})
    }
}


const updateVideogame = async (req, res) => {
    try {
        const updatedVideogame = await Videogame.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true
        })
        if (!updatedVideogame) {
            return res.status(404).json({error: "Videojuego no encontrado"})
        }
        return res.status(200).json(updateVideogame)
    } catch (error) {
        res.status(400).json({error: "Error al actualizar el videojuego", detalles: error.message})
    }
}


const deleteVideogame = async (req, res) => {
    try {
        const deletedVideogame = await Videogame.findByIdAndDelete(req.params.id)
        if(!deleteVideogame){
            return res.status(404).json({error: "Videojuego no encontrado"})
    }
        res.status(200).json("Videojuego eliminado correctamente")
    } catch (error) {
        res.status(404).json({error: "Error al eliminar el videojuego", detalles: error.message})
    }
}


const searchVideogamesByTitle = async (req, res) => {
    try {
        const { title } = req.query
        if(!title) {
            return res.status(400).json({error: "Debes indicar el título"})
        }
        const videogames = await Videogame.find({title: new RegExp(title, "i")})
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al buscar videojuegos", detalles: error.message})
    }
}


const getVideogamesByGenre = async (req, res) => {
    try {
        const { genre } = req.params
        const videogames = await Videogame.find({ genre })
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al buscar por genero", detalles: error.message})
    }
}


const getVideogamesTopRated = async (req,res) => {
    try {
        const videogames = await Videogame.find().sort({rating: -1}).limit(5)
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los videojuegos mejor valorados", detalles: error.message})
    }
}


const getRandomVideogame = async (req, res) => {
    try {
        const total = await Videogame.countDocuments();
        if (total === 0) return res.status(404).json({error: "No hay videojuegos disponibles"})
        const randomIndex = Math.floor(Math.random() * total)
        const videogame = await Videogame.findOne().skip(randomIndex)
        res.status(200).json(videogame)
    } catch (error) {
        res.status(500).json({error: "Error al obtener un videojuego aleatorio", detalles: error.message})
    }
}


const bulkCreateVideogames = async (req, res) => {
    try {
        const videogames = req.body
        if (!Array.isArray(videogames) || videogames.length === 0) {
            return res.status(400).json({error: "Debes enviar un array de videojuegos"})
        }
        const uploaded = await Videogame.insertMany(videogames)
        res.status(201).json({cantidad: uploaded.length, videogames: uploaded})
    } catch (error) {
        res.status(400).json({error: "Error al insertar varios videojuegos", detalle: error.message})
    }
}

module.exports = {
    getVideogames,
    getVideogamesById,
    createVideogame,
    updateVideogame,
    deleteVideogame,
    searchVideogamesByTitle,
    getVideogamesByGenre,
    getVideogamesTopRated,
    getRandomVideogame,
    bulkCreateVideogames
}