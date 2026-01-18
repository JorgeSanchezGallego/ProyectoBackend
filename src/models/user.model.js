const mongoose = require("mongoose") //Importamos mongoose
const bcrypt = require("bcrypt") //Libreria para encriptar la contraseña

const userSchema = new mongoose.Schema( //Creamos nuevo schema
    {
        nombre: {type: String, required: true, trim:true}, //Trim elimina espacios en blanco al principio y al final
        nickname: {type: String, required: true, trim: true, unique: true},
        email: {type: String, required: true, trim: true, unique: true}, //Unique te asegura email unico
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [8, "La contraseña debe tener al menos 8 caracteres"], //Contraseña de minimo 8 caracteres
        },
        videogames: [
            {
                type: mongoose.Types.ObjectId,
                ref:"Videogame", //Guardamos un array de videojuegos que apuntan al id del videogame
            },
        ],
        role: {
            type: String,
            enum: ["admin", "user"], //Solo puede ser estos campos
            default: "user" //Si no especifica, user
        },
        img: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true, //Crea campos createdAt y updatedAt
        versionKey: false //Elimina el campo __v interno de mongo
    }
)


userSchema.pre("save", function () { //Se ejecuta ANTES de hacer un .save() Usamos function para tener acceso a this
    if (!this.isModified("password")) { //Si la contraseña no se ha modificado, no reencriptamos la contraseña
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10); //Encriptamos la contraseña con un coste de 10 vueltas
})

const User = mongoose.model("User", userSchema)

module.exports = User;