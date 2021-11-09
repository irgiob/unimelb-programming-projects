// initialize requirements
const express = require("express")
const customerRouter = express.Router()

const orderHandlerRouter = require("./customerOrderHandlerRouter")
const menuRouter = require("./menuRouter")
const customerAuthRouter = require("./customerAuthRouter")

const addToCartController = require("../../controllers/customer/cartController")

// set additional sub routes
customerRouter.use('/order', orderHandlerRouter)
customerRouter.use('/menu', menuRouter)
customerRouter.use('/auth', customerAuthRouter)

customerRouter.post('/addToCart', (req, res) => {
    addToCartController.addToCart(req, res)
})

customerRouter.get('/cart', (req, res) => {
    addToCartController.viewCart(req, res)
})

// export router
module.exports = customerRouter