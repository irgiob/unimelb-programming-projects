// intialize requirements
const express = require('express')

const menuRouter = express.Router()

const menuController = require("../../controllers/customer/menuController")

// process routes by calling controller functions

// Get entire menu
menuRouter.get('/', (req, res) =>
    menuController.viewMenu(req, res)
)

// View snack detail
menuRouter.get('/:snackId', (req, res) =>
    menuController.viewSnack(req, res)
)

// export router
module.exports = menuRouter