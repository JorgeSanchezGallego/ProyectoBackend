const multer = require("multer")
const cloudinary = require("cloudinary").v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const storageGames = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Videogames",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

const storageUsers = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Users",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

const uploadGames = multer({storage: storageGames})
const uploadUsers = multer({storage: storageUsers})

module.exports = { uploadGames, uploadUsers }