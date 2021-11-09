const mongoose = require("mongoose")
const VanAuth = mongoose.model("VanAuth")
const bcrypt = require("bcrypt")
const saltRounds = 12

const vanLogin = async (req, res) => {

    // Checks if the vanName is in an existing account
    let van
    try {
        van = await VanAuth.findOne({"vendorName": req.body.vanName})
        if (!van) {
            res.status(400)
            return res.send({
                error: "reg-0001",
                message: "van name does not exist, register?"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(503)
        return res.send({
            error: "db-0001",
            message: "Could not find login"
        })
    }

    // Matches the password with the database
    let isMatch;
    try {
        isMatch = bcrypt.compare(req.body.password, van.password)
        if(!isMatch){
            console.log("INCORRECT PASSWORD")
            res.status(200)
            return res.send({
                error: "auth-0002",
                message: "Error when comparing password"
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
    console.log("Login successfull")
    res.cookie("Login", van._id, {
        signed: true,
        maxAge: 90000
    })
    res.status(200)
    return res.send({
        login: "Successful",
        message: (({ _id, vendorName}) =>
            ({ _id, vendorName}))(van)
    })
}

const vanRegister = async (req, res) => {

    // Register van, takes in van name and password
    
    // Checks if van name is taken
    let van = {};
    try {
        van = await VanAuth.findOne({ "vendorName": req.body.vanName })
        if (van !== null){
            res.status(400)
            return res.return({
                error: "reg-0001",
                message: "van name taken"
            })
        }

    } catch (err){
        console.log(err)
            res.status(500)
            return res.send({
                error: "db-0001",
                message: "Error when finding van"
            })
    }

    // Encrypt password
    let salt;
    let hash;

    try {
        salt = await bcrypt.genSalt(saltRounds)
        hash = await bcrypt.hash(req.body.password, salt)
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "auth-0002",
            message: "Error when encrypting password"
        })
    }

    const obj = {
        "vendorName": req.body.vanName,
        "password": hash,
        "status": "OPEN"
    }

    // Create the van document
    try {
        van = await VanAuth.create(obj)
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0002",
            message: "Cannot create new van"
        })
    }

    res.status(200)
    return res.send({
        id: van._id,
        register: "Sucessful"
    })
}

module.exports = {
    vanLogin,
    vanRegister
}