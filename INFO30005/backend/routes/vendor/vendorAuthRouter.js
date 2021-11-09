// initialize requirements
const express = require('express')

const vendorLoginRouter = express.Router()

const vendorLoginController = require("../../controllers/vendor/vendorAuthController")

// process route by calling controller functions
vendorLoginRouter.post('/login', (req, res) =>
    vendorLoginController.vanLogin(req, res)
)

vendorLoginRouter.get('/register', (req, res) =>
    {
        res.send("Vendor REGISTER PAGE")
    }
)

vendorLoginRouter.post('/register', (req, res) =>
    vendorLoginController.vanRegister(req, res)    
)

// export router
module.exports = vendorLoginRouter
