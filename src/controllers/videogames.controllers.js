const Videogame = require("../models/videogame.model")
const { deleteImgCloudinary } = require("../utils/cloudinary.utils")

const getVideogames = async (req, res) => { //Listamos todos los videojuegos
    try {
        const videogames = await Videogame.find(); //Find devuelve toda la coleccion
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los videojuegos ❌"})
    }
}


const getVideogamesById = async (req, res) => { //Buscamos por id
    try {
        const videogame = await Videogame.findById(req.params.id) //No continuamos hasta que se resuelva esta peticion
        if (!videogame){ //Verificamos si es null, por que findbyId no lanza error si no la encuentra 
            return res.status(404).json({error: "Videojuego no encontrado"})
        }
        res.status(200).json(videogame)
    } catch (error) {
        res.status(400).json({error: "ID inválido o error en la búsqueda"})
    }
}


const createVideogame = async (req, res) => { //Subida de videojuego
    try {
        const newVideogame = new Videogame(req.body); //Intanciamos el modelo con los datos del req.body
        if (req.file) { //Gestionamos la imagen, multer la deja en req.file
            newVideogame.img = req.file.path;
        } else {
            return res.status(400).json("La imagen de perfil es obligatoria");
        }
        const videogameDB = await newVideogame.save(); //Guardamos en mongo, hasta que no se complete no se avanza
        res.status(200).json(videogameDB)
    } catch (error) {
        if (req.file && req.file.path){ //Limpiamos si hay error y borramos la imagen
            deleteImgCloudinary(req.file.path)
        }

        if (error.code === 11000){ //Gestion de duplicados
            return res.status(409).json({error: "Juego duplicado", detalle: error.message})
        }
        res.status(400).json({error: "Error al crear el videojuego", detalles: error.message})
    }
}


const updateVideogame = async (req, res) => { //Actualizar videojuego
    try {
        const { id } = req.params //Destructuring y guardamos el id
        const prev = await Videogame.findById(id) //Capturamos el videogame por id y no avanza hasta que se complete
        if (!prev) return res.status(404).json({error: "Videojuego no encontrado"}) //Mensaje de error

        const updates = {...req.body}; //Nuevo juego
        let newImgId = null;
        if (req.file){//Si el usuario sube una imagen nueva
            updates.img = req.file.path //Actualizamos la imagen
            deleteImgCloudinary(prev.img);//Borramos la antigua
        }
        const updated = await Videogame.findByIdAndUpdate(id, updates,{ //Aplicamos la actualizacion
            new: true, //Devuelve el objeto ya modificado
            runValidators: true //Asegura que las reglas del modelo se respetan al editar
        })
        return res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({error: "Error al actualizar el videojuego", detalles: error.message})
    }
}


const deleteVideogame = async (req, res) => { //Borrar videojuego
    try {
        const { id } = req.params //Recuperamos el id
        const deleted = await Videogame.findByIdAndDelete(id) //Buscamos y borramos en un solo paso y lo almacenamos en una variable
        if (!deleted) return res.status(404).json({error: "Videojuego no encontrado"})
        deleteImgCloudinary(deleted.img)//Borramos imagen de cloudinary
        return res.status(200).json({mensaje: "Videojuego eliminado correctamente", elemento: deleted}) //Usamos la variable para mostrar por pantalla el videojuego borrado
    } catch (error) {
        res.status(404).json({error: "Error al eliminar el videojuego", detalles: error.message})
    }
}


const searchVideogamesByTitle = async (req, res) => { //Busqueda por titulo
    try {
        const { title } = req.query //Recuperamos el title
        if(!title) { // Comprobaciones
            return res.status(400).json({error: "Debes indicar el título"})
        }
        const videogames = await Videogame.find({title: new RegExp(title, "i")}) //Buscamos por titulo y le decimos que sea insensitivo a mayusculas
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al buscar videojuegos", detalles: error.message})
    }
}


const getVideogamesByGenre = async (req, res) => { //Busqueda por genero
    try {
        const { genre } = req.params //Recuperamos el genre
        const videogames = await Videogame.find({ genre }) //Buscamos el videojuego por genre
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al buscar por genero", detalles: error.message})
    }
}


const getVideogamesTopRated = async (req,res) => { //Mejores valorados
    try {
        const videogames = await Videogame.find().sort({rating: -1}).limit(5) //Orden descendente, y limitados a 5
        res.status(200).json(videogames)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los videojuegos mejor valorados", detalles: error.message})
    }
}


const getRandomVideogame = async (req, res) => { //Obtener juego aleatorio
    try {
        const total = await Videogame.countDocuments(); //Contamos cuantos juegos hay en total
        if (total === 0) return res.status(404).json({error: "No hay videojuegos disponibles"}) //Si es 0, no hay videojuegos
        const randomIndex = Math.floor(Math.random() * total) //Generamos un numero aleatorio entre 0 y total
        const videogame = await Videogame.findOne().skip(randomIndex) //Saltamos esa cantidad de documentos y cogemos el siguiente
        res.status(200).json(videogame)
    } catch (error) {
        res.status(500).json({error: "Error al obtener un videojuego aleatorio", detalles: error.message})
    }
}


const bulkCreateVideogames = async (req, res) => { //Carga masiva
    try {
        const videogames = req.body
        if (!Array.isArray(videogames) || videogames.length === 0) {
            return res.status(400).json({error: "Debes enviar un array de videojuegos"})
        }
        const uploaded = await Videogame.insertMany(videogames, {ordered:false}) //Ordered false para que si un juego da error, no se pare todo lo demas
        res.status(201).json({cantidad: uploaded.length, videogames: uploaded})
    } catch (error) {
        if (error.code === 11000 || error.writeErrors) {// Gestión especial para insertMany con ordered:false
            const guardados = error.insertedDocs || []
            const fallidos = error.writeErrors?.length || 0
            return res.status(201).json({  //Mostramos informacion de lo que ha pasado 
                mensaje: "Proceso finalizado con algunos duplicados omitidos",
                guardados: guardados.length,
                duplicados_omitidos: fallidos,
                juegos_guardados: guardados
            })
        }
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