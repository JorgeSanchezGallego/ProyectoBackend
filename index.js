require("dotenv").config();

const express = require("express")
const app = express();
const { connectDB} = require("./src/config/db")
const videoGameRoutes = require("./src/routes/videogames.routes")

app.use(express.json());
connectDB();


app.use("/api/videogames", videoGameRoutes)


app.use((req, res) => {
    return res.status(404).json("Route not found")
})

app.listen(3000, () => {
    console.log("Servidor corriendo en: http://localhost:3000")
})

