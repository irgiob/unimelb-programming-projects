const mongoose = require("mongoose")
const Customer = mongoose.model("Customer")
const bcrypt = require("bcrypt")
const saltRounds = 12

const login = async (req, res) => {

    // Login : takes in email and password

    // Checks if the body is empty
    if (!req.body) {
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "Body is empty"
        })
    }

    // Checks if the email corresponds to any customer in the database
    let customer
    try {
        customer = await Customer.findOne({"email":req.body.email})
        if (!customer){
            res.status(503)
            return res.send({
                error: "db-0001",
                message: "No customer with that email address found"
            })
        }
    } catch(err) {
        console.log(err)
        res.status(503)
        return res.send({
            error : "db-0001",
            message : "Could not find login"
        })
    }

    // Checks if the password matches
    let isMatch
    try {
        isMatch = await bcrypt.compare(req.body.password, customer.password)
        if (!isMatch) {
            console.log("incorrect password")
            res.status(200)
            return res.send({
                login: "Failed",
                message: "Wrong password"
            })
        }

    } catch(err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "auth-0002",
            message: "Error when comparing password"
        })
    }


    console.log(`Customer with id ${customer._id} successfully login`)
    res.cookie("Login", customer._id, {
        signed: true,
        maxAge: 90000
    })
    res.status(200)
    return res.send({
        login: "Successful",
        message: (({ _id, firstName, lastName, email, cart }) =>
            ({ _id, firstName, lastName, email, cart }))(customer)
    })
                
}

const register = async (req, res) => {

    // Register, takes in post request for firstName, lastName, password, email

    // Checks if the email is taken
    let customer;
    try {
        customer = await Customer.findOne( { "email": req.body.email } )
        if (customer){
            res.status(503)
            return res.send({
                error: "reg-0001",
                message: "Email taken"
            })
        }
    } catch(err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Error when finding customer"
        })
    }

    // Encrypt password 
    let salt, hash;
    try {
        salt = await bcrypt.genSalt(saltRounds)
        hash = await bcrypt.hash(req.body.password, salt)
    } catch (err) {
        console.log("Error in gen salt")
        console.log(err)
        res.status(500)
        return res.send({
            error: "auth-0002",
            message: "Error in encrypting"
        })
    }


    // Create docs in database
    const obj = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "password": hash,
        "email": req.body.email,
        "cart": {}
    }
    
    let newCustomer;
    try {
        newCustomer = await Customer.create(obj)
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0002",
            message: "Cannot create new customer"
        })
    }

    console.log(`New customer created : ID: ${newCustomer._id}`)
    res.status(200)
    return res.send({
        register: "Sucessful",
        id : newCustomer._id
    })
    
}

const updateCustomerAccount = async (req, res) => {

    // Checks that incoming request has the necessary fields
    if (req.headers.login === undefined) {
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

    // Checks if customer exists in the database
    let customer = {};
    try {
        customer = await Customer.findOne({"_id": req.headers.login})
        if (!customer){
            console.log("FAKE COOKIE")
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


    // Add changed field, all of which is optional
    updateObj = {}
    if (req.body.newPassword !== undefined){
        // Encrypt new password
        let salt, hash;
        try {
            salt = await bcrypt.genSalt(saltRounds)
            hash = await bcrypt.hash(req.body.newPassword, salt)
        } catch (err) {
            console.log("Error in gen salt")
            console.log(err)
            res.status(500)
            return res.send({
                error: "auth-0002",
                message: "Error in encrypting"
            })
        }
        updateObj["password"] = hash;
    }
    if (req.body.newFirstName !== undefined){
        updateObj["firstName"] = req.body.newFirstName
    }
    if(req.body.newLastName !== undefined){
        updateObj["lastName"] = req.body.newLastName
    }

    // Checks if there are proper changes to be made
    if ( Object.keys(updateObj).length === 0 ){
        res.status(400)
        return res.send({
            error: "body-0002",
            message: "No proper body type, make sure one of the fields : newPassword, newFirstName or newLastName is none empty"
        })
    }

    // Updates the customer data in the database
    try {
        customer = await Customer.findOneAndUpdate({"_id": req.headers.login}, updateObj, {new:true})
    } catch (err) {
        console.log(err)
        res.status(500) 
        return res.send({
            error : "db-0003",
            message: "Could not find/update customer in the database"
        })
    }

    console.log(`Customer updated ID: ${customer._id}`)
    res.status(200)
    return res.send(customer)


}

module.exports = {
    login,
    register,
    updateCustomerAccount
}