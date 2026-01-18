const cloudinary = require("cloudinary").v2 //Importamos cloudinary para utilizar destroy


const deleteImgCloudinary = (url) => { //Recibimos la url de la imagen
    const array = url.split("/"); //Dividimos la url por las barras para tener un array
    const name = array.at(-1).split(".")[0];//-1 cogemos la ultima posicion del array, ej: imagen.jpg, spliteamos por el punto y cogemos la posicion 0 que es "imagen"

    let public_id = `${array.at(-2)}/${name}`;  // array.at(-2) coge el penúltimo elemento, que es la CARPETA (ej: "Users" o "Videogames").
                                                // Montamos el string final que Cloudinary entiende: "Users/foto-perfil"

    cloudinary.uploader.destroy(public_id, () => { //Busca este id y destruyelo
        console.log("Imagen eliminada");
        
    })
}


module.exports = {deleteImgCloudinary}

