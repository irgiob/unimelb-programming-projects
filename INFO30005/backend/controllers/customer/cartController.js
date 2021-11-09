// initialize requirements
const mongoose = require("mongoose")

const Customer = mongoose.model("Customer")

const viewCart = async (req, res) => {

    // Check if login cookie exists
    if (req.headers.login  == undefined) {
        console.log("Not yet logged in")
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before creating order"
        })
    }

    // Checks if the cookie passed it corresponds to a customer
    let customer 
    try {
        customer = await Customer.findOne({ "_id": req.headers.login  })
        if (!customer) {
            res.status(503)
            return res.send({
                error: "auth-0004",
                message: "Invalid cookie"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error : "db-0001",
            message: "Could not find customer in the database"
        })
    }

    let customerObj = JSON.parse(JSON.stringify(customer));
    console.log(customerObj.cart)
    res.status(200)
    return res.send(customerObj.cart)

}

const addToCart = async (req, res) => {

    // Check if login cookie exists
    if (req.headers.login == undefined) {
        console.log("Not yet logged in")
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before creating order"
        })
    }
    if (!req.body) {
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "Body is empty"
        })
    }


    // Checks if the cookie passed it corresponds to a customer
    let customer
    try {
        customer = await Customer.findOne({ "_id": req.headers.login  })
        if (!customer) {
            res.status(503)
            return res.send({
                error: "auth-0004",
                message: "Invalid cookie"
            })
        } 
    } catch(err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not retrieve customer of cookie"
        })
    }

    // Creates object to update the customer's cart
    const customerObj = JSON.parse(JSON.stringify(customer));
    customerObj.cart[req.body.snackId] = req.body.quantity
    console.log(customerObj.cart)
    const updateObj = {
        "cart": customerObj.cart,
    }

    try {
        customer = await Customer.findOneAndUpdate({ "_id": req.headers.login  }, updateObj , {new:true})
    } catch(err) {
        console.log(err)
        res.status(503)
        return res.send({
            error: "db-0003",
            message: "Fail to find/update cart"
        })
    }

    res.status(200)
    return res.send(customer.cart)

}

module.exports = { addToCart, viewCart }