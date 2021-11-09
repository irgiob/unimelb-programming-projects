// initialize requirements
const express = require('express')

const customerLoginRouter = express.Router()

const customerLoginController = require("../../controllers/customer/customerAuthController")

// process route by calling controller functions
customerLoginRouter.post('/login', (req, res) =>
    customerLoginController.login(req, res)
)

customerLoginRouter.get('/register', (req, res) =>
    {
        res.send("REGISTER PAGE")
    }
)

customerLoginRouter.post('/register', (req, res) =>
    customerLoginController.register(req, res)
)

customerLoginRouter.post('/update', (req, res) =>
    customerLoginController.updateCustomerAccount(req, res)
)

// export router
module.exports = customerLoginRouter