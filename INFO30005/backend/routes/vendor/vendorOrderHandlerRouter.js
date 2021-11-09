// intialize requirements
const express = require('express')

const orderHandlerRouter = express.Router()

const orderHandlerController = require("../../controllers/vendor/vendorOrderHandlerController")

// process routes by calling controller functions
orderHandlerRouter.get('/', orderHandlerController.viewOrders)
orderHandlerRouter.post('/completeOrder', orderHandlerController.completeOrder)
orderHandlerRouter.post('/readyOrder', orderHandlerController.readyOrder)

// export router
module.exports = orderHandlerRouter