const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
       nombre: {type: String, required: true, trim:true},
       nickname: {type: String, required: true, trim: true, unique: true},
       email: {type: String, required: true, trim: true, unique: true},
       password: {
            type: String,
            trim: true,
            required: true,
            minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
       },
       videogames: [
            {
                type: mongoose.Types.ObjectId,
                ref:"Videogame",
            },
       ],
       role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        img: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)


userSchema.pre("save", function () {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
})

const User = mongoose.model("User", userSchema)

module.exports = User;