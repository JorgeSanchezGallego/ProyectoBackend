require("dotenv").config(); //Cargamos las variables de entorno
const cloudinary = require("cloudinary").v2;//Importamos cloudinaryV2

const connectCloudinary = () => {
    try {
        cloudinary.config({ //Le pasamos las credenciales necesarias para saber donde subir las fotos
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET})
        console.log("Conectamos con exito a cloudinary");//Confirmacion de que todo va bien
        
    } catch (error) {
        console.log("Error al conectar a cloudinary"); //Mostramos error
        
    }
    
}

module.exports = {connectCloudinary}