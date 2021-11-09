const mongoose = require("mongoose")

const VanAuth = mongoose.model("VanAuth")


// Sets location of the van and sets the status to open
const setLocation = async (req, res) => {

    // Authenticate user
    if (req.headers.login === undefined || req.headers.login === null) {
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before cancelling order"
        })
    }

    let van;
    try {
        // Checks if associated customer exists
        van = await VanAuth.findOne({"_id": req.headers.login});
        if (!van){
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
            error: "db-0001",
            message: "Could not retrieve vendor of cookie"
        })
    }

    // Checks if location description and geolocation exists
    if (req.body.locationDescription === undefined || req.body.geolocation === undefined ||
        req.body.locationDescription === null || req.body.geolocation === null) {
        res.status(400)
        return res.send({
            error: "body-0002",
            message: "Missing geolocation or location description"
        })
    }

    // function is used both for first opening and for updating location
    const updateObj = {
        locationDescription: req.body.locationDescription,
        geolocation: req.body.geolocation,
        status: "OPEN"
    }
    console.log(updateObj)

    try {
        van = await VanAuth.findOneAndUpdate({ _id: req.headers.login }, updateObj, {new:true})
    } catch(err) {
        console.log(err)
        console.log("ERROR: vendorHandlerController.viewAllOutstanding: fail to find/update order")
        res.status(503)
        return res.send({
            error: "db-0003",
            message: "Fail to find/update order"
        })
    }
    
    res.status(200)
    return res.send(van)
}

// Closes a vendor and so can no longer be ordered from
const closeVendor = async (req, res) => {
    // Authenticate user
    if (req.headers.login === undefined) {
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before cancelling order"
        })
    }

    let van;
    try {
        // Checks if associated customer exists
        van = await VanAuth.findOne({"_id": req.headers.login});
        if (!van){
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
            error: "db-0001",
            message: "Could not retrieve customer of cookie"
        })
    }

    // function is used both for first opening and for updating location
    const updateObj = {
        status: "CLOSED"
    }

    try {
        van = await VanAuth.findOneAndUpdate({ _id: req.headers.login }, updateObj, {new:true})
    } catch(err) {
        console.log(err)
        console.log("ERROR: vendorHandlerController.viewAllOutstanding: fail to find/update order")
        res.status(503)
        return res.send({
            error: "db-0003",
            message: "Fail to find/update order"
        })
    }
    
    res.status(200)
    return res.send(van)
}

// Create a new van
const createNewVan = async (req, res) => {

    newVan = new VanAuth(req.body)
    console.log(newVan)
    try {
        const result = await newVan.save()
        console.log(result)
        return res.send(result)
    } catch (err) {
        console.log(err)
        res.status(400)
        return res.send("Database insert failed")
    }

}

module.exports = {
    setLocation,
    closeVendor,
    createNewVan
}