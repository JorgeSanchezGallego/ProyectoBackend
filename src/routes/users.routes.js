const express = require("express")
const { registerUser, loginUser, getUsers, deleteUser, updateUserRol, addGameToUser, deleteGameToUser } = require("../controllers/users.controllers")
const { isAuth, isAdmin } = require("../middlewares/auth.middleware") //Importamos middleware necesarios
const { uploadUsers } = require("../middlewares/file") //Configuracion de multer

const router = express.Router()

router.post("/register",uploadUsers.single("img"), registerUser) //Espera un archivo "img"
router.post("/login", loginUser)
router.get("/", [isAuth, isAdmin], getUsers)//Primero isAuth para ver que estas logueado, y luego comprueba si eres admin para mostrarte los usuarios
router.patch("/update-role/:id", [isAuth, isAdmin], updateUserRol)//Primero isAuth para ver que estas logueado, y luego comprueba si eres admin para mostrarte los usuarios
router.post("/add-game", isAuth, addGameToUser)
router.delete("/delete-game", isAuth, deleteGameToUser)
router.delete("/:id", isAuth, deleteUser)

module.exports = router