const express = require("express")
const { registerUser, loginUser, getUsers, deleteUser, updateUserRol } = require("../controllers/users.controllers")
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { uploadUsers } = require("../middlewares/file")

const router = express.Router()

router.post("/register",uploadUsers.single("img"), registerUser)
router.post("/login", loginUser)
router.get("/", [isAuth, isAdmin], getUsers)
router.patch("/update-role/:id", [isAuth, isAdmin], updateUserRol)
router.delete("/:id", isAuth, deleteUser)

module.exports = router