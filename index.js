require("dotenv").config(); //Carga las .ENV 

const express = require("express")
const app = express(); //Iniciamos la app Express
const { connectDB} = require("./src/config/db") // Importamos las configuraciones de BBDD
const videoGameRoutes = require("./src/routes/videogames.routes") //Importamos las rutas
const userRoutes = require("./src/routes/users.routes");//Importamos las rutas
const { connectCloudinary } = require("./src/config/cloudinary");// Importamos las configuraciones de cloudinary

app.use(express.json()); //Transforma las peticiones req.body a json
connectDB(); //Conectamos base de datos y cloudinary
connectCloudinary();


app.use("/api/videogames", videoGameRoutes) //Peticion que empiece por /api/videogames se va a al router de videogames
app.use("/api/users", userRoutes)//Peticion que empiece por /api/users se va a al router de users


app.use((req, res) => { //Si la peticion llega aqui, not found
    return res.status(404).json("Route not found")
})

app.listen(3000, () => { //Arrancamos servidor
    console.log("Servidor corriendo en: http://localhost:3000")
})

