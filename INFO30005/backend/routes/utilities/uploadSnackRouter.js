// initialize requirements
const express = require('express')

const uploadSnackRouter = express.Router()

const uploadSnackContorller = require("../../controllers/utilities/uploadSnackController")

const uploadStorage = require("../../middleware/uploadStorage")

// process routes by calling controller functions

// Handles the get requests, provides form to upload image to MongoDB
uploadSnackRouter.get('/', uploadStorage.single('image'), uploadSnackContorller.uploadGetSnack)

// Handles the form that contains the file and file details, uploads to MongoDB
uploadSnackRouter.post('/', uploadStorage.single('image'), uploadSnackContorller.uploadPostSnack)

// export router
module.exports = uploadSnackRouter