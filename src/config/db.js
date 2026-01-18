const mongoose = require("mongoose"); //Importamos mongoose

const connectDB = async () => { //Montamos funcion async por que no es instantaneo, necesita await mas abajo
    try {
        await mongoose.connect(process.env.DB_URL); //Conectamos con la Database y hasta que no termine no continua
        console.log("Conectado con éxito a la BBDD ✅"); //Mensaje de exito
        
    } catch (error) {
        console.log("Error en la conexión a la BBDD ❌");//Mensaje de error
        
    }
}

module.exports = { connectDB }