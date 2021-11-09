// initialize requirements
const express = require('express')

const vendorHandlerRouter = express.Router()

const vendorHandlerController = require("../../controllers/vendor/vendorHandlerController")

// process routes by calling controller functions
vendorHandlerRouter.post("/setLocation", vendorHandlerController.setLocation)
vendorHandlerRouter.post("/close", vendorHandlerController.closeVendor)
vendorHandlerRouter.post('/create', vendorHandlerController.createNewVan)

// export router
module.exports = vendorHandlerRouter