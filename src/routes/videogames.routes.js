const express = require("express")
const router = express.Router()
const { uploadGames } = require("../middlewares/file")
const {
    getVideogames,
    getVideogamesById,
    createVideogame,
    updateVideogame,
    deleteVideogame,
    searchVideogamesByTitle,
    getVideogamesByGenre,
    getVideogamesTopRated,
    getRandomVideogame,
    bulkCreateVideogames
} = require("../controllers/videogames.controllers")



router.get("/search", searchVideogamesByTitle)
router.get("/genre/:genre", getVideogamesByGenre)
router.get("/top-rated", getVideogamesTopRated)
router.get("/random", getRandomVideogame)
router.get("/bulk", bulkCreateVideogames)



router.get("/", getVideogames)
router.post("/", uploadGames.single("img"), createVideogame)
router.get("/:id", getVideogamesById)
router.put("/:id", updateVideogame)
router.delete("/:id", deleteVideogame)

module.exports = router