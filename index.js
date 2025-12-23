require("dotenv").config();

const express = require("express")
const app = express();
const { connectDB} = require("./src/config/db")
const videoGameRoutes = require("./src/routes/videogames.routes")
const userRoutes = require("./src/routes/users.routes");
const { connectCloudinary } = require("./src/config/cloudinary");

app.use(express.json());
connectDB();
connectCloudinary();


app.use("/api/videogames", videoGameRoutes)
app.use("/api/users", userRoutes)


app.use((req, res) => {
    return res.status(404).json("Route not found")
})

app.listen(3000, () => {
    console.log("Servidor corriendo en: http://localhost:3000")
})

