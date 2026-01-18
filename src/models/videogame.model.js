const mongoose = require("mongoose")
const Schema = mongoose.Schema


const videogameSchema = new Schema(
    {
        title: {type: String, required: true, trim: true, unique: true},//Trim elimina espacios en blanco al principio y al final. Unique te asegura titulo unico
        developer: {type: String, required: true, trim: true},
        year: {type: Number, min: 1980, max: 2030, required: true},
        genre: {
            type: String,
            enum: ["Acción", "Aventura", "RPG", "Shooter", "Deportes", "Indie", "Plataformas", "Terror"],
            required: true,
        },
        platform: {
            type: String,
            enum: ["PC", "PS5", "Xbox Series X", "Nintendo Switch", "Multiplataforma"],
            required: true,
        },
        rating: {type: Number, min: 0, max: 10, default: 5,},
        img: {type: String,  required: true}
    },
    {
        timestamps: true,//Crea campos createdAt y updatedAt
        versionKey: false//Elimina el campo __v interno de mongo
    }
)

const Videogame = mongoose.model("Videogame", videogameSchema)

module.exports = Videogame;