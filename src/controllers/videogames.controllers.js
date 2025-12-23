const Videogame = require("../models/videogame.model")
const { deleteImgCloudinary } = require("../utils/cloudinary.utils")

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
        const newVideogame = new Videogame(req.body);
        if (req.file) {
            newVideogame.img = req.file.path;
        } else {
            return res.status(400).json("La imagen de perfil es obligatoria");
        }
        const videogameDB = await newVideogame.save();
        res.status(200).json(videogameDB)
    } catch (error) {
        res.status(400).json({error: "Error al crear el videojuego", detalles: error.message})
    }
}


const updateVideogame = async (req, res) => {
    try {
        const { id } = req.params
        const prev = await Videogame.findById(id)
        if (!prev) return res.status(404).json({error: "Videojuego no encontrado"})

        const updates = {...req.body};
        let newImgId = null;
        if (req.file){
            updates.img = req.file.path
            deleteImgCloudinary(prev.img);
        }
        const updated = await Videogame.findByIdAndUpdate(id, updates,{
            new: true, 
            runValidators: true
        })
        return res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({error: "Error al actualizar el videojuego", detalles: error.message})
    }
}


const deleteVideogame = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Videogame.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({error: "Videojuego no encontrada"})
        deleteImgCloudinary(deleted.img)
        return res.status(200).json({mensaje: "Videojuego eliminado correctamente", elemento: deleted})
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