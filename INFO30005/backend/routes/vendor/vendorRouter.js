// initialize requirements
const express = require("express")
const vendorRouter = express.Router()

const orderHandlingRouter = require("./vendorOrderHandlerRouter")
const vendorHandlerRouter = require("./vendorHandlerRouter")

const vendorController = require("../../controllers/vendor/vendorController")
const vendorAuthController = require("./vendorAuthRouter")

// set additional sub routes
vendorRouter.use('/orders', orderHandlingRouter)
vendorRouter.use('/setVendor', vendorHandlerRouter)
vendorRouter.use('/auth', vendorAuthController)


// process routes by calling controller functions
vendorRouter.get('/', vendorController.getAllVans)
vendorRouter.get('/:vendorId', vendorController.getOneVan)
vendorRouter.get('/ratings/:vendorId', vendorController.getRating)



// export router
module.exports = vendorRouter