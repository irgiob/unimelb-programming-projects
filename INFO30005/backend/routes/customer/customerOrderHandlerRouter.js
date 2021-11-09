// initialize requirements
const express = require('express')

const orderHandlerRouter = express.Router()

const orderHandlerController = require("../../controllers/customer/customerOrderHandlerController")

// process route by calling controller functions
orderHandlerRouter.post('/createOrder', (req, res) =>
    orderHandlerController.createOrder(req, res)
)

// gets all order of a customer
orderHandlerRouter.post('/getOrder', (req, res) =>
    orderHandlerController.getOrder(req, res)
)

// Cancels order
orderHandlerRouter.post('/cancelOrder', (req, res) => {
    orderHandlerController.cancelOrder(req, res)
})

// Overwrites order
orderHandlerRouter.post('/updateOrder', (req, res) => {
    orderHandlerController.overwriteOrder(req, res)
})

// Rate van
orderHandlerRouter.post('/rateVan', (req, res) => {
    orderHandlerController.rateVan(req, res)
})

// export router
module.exports = orderHandlerRouter