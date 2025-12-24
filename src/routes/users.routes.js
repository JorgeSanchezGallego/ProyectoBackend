const express = require("express")
const { registerUser, loginUser, getUsers, deleteUser, updateUserRol, addGameToUser, deleteGameToUser } = require("../controllers/users.controllers")
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { uploadUsers } = require("../middlewares/file")

const router = express.Router()

router.post("/register",uploadUsers.single("img"), registerUser)
router.post("/login", loginUser)
router.get("/", [isAuth, isAdmin], getUsers)
router.patch("/update-role/:id", [isAuth, isAdmin], updateUserRol)
router.post("/add-game", isAuth, addGameToUser)
router.delete("/delete-game", isAuth, deleteGameToUser)
router.delete("/:id", isAuth, deleteUser)

module.exports = router