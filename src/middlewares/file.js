const multer = require("multer") //Libreria para manejar peticiones "multipart/form-data"
const cloudinary = require("cloudinary").v2 //Comunicacion con la nube
const {CloudinaryStorage} = require("multer-storage-cloudinary") //Puente para que el archivo no se guarde en tu disco y si en la nube 

const storageGames = new CloudinaryStorage({//Configuramos donde y como se guardan las fotos
    cloudinary: cloudinary,
    params: {
        folder: "Videogames",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

const storageUsers = new CloudinaryStorage({//Configuramos como y donde se guardan los avatares
    cloudinary: cloudinary,
    params: {
        folder: "Users",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

const uploadGames = multer({storage: storageGames})//Inicializamos Multer con las estrategias definidas arriba
const uploadUsers = multer({storage: storageUsers})

module.exports = { uploadGames, uploadUsers }