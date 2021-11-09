const mongoose = require("mongoose")
const Order = mongoose.model("Order")
const VanAuth = mongoose.model("VanAuth")

// view orders associated to a vendor or status
const viewOrders = async (req, res) => {

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

    // add optional parameters (vendorId and status) to search query
    var status = req.query.status
    var customerId = req.query.customerId
    var query = {}
    query.orderedFrom = req.headers.login
    if (typeof status !== 'undefined') {
        query.orderStatus = status
    }
    if (typeof customerId !== 'undefined') {
        query.orderedBy = customerId
    }

    let orders;
    try {
        orders = await Order.find(query)
    } catch (err) {
        console.log(err)
        res.status(503)
        return res.send({
            error: "db-0001",
            message: "Could not get order of that van"
        })
    }
    res.status(200)
    return res.send(orders)
}

// set an existing order to READY
const readyOrder = async (req, res) => {

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
            message: "Could not retrieve vendor of cookie"
        })
    }

    const finishTime = Date.now()
    const updateObj = {
        "orderStatus": "READY",
        "finishTime": finishTime
    }

    let order;
    try {
        order = await Order.findOneAndUpdate({ _id: req.body.orderId }, updateObj, {new:true})
        if (!order) {
            console.log("ERROR: orderHandlerController.viewAllOutstanding: fail to find/update order")
            console.log(err)
            res.status(400)
            return res.send({
                error: "body-0002",
                message: "Order of that id does not exist in the system"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(503)
        return res.send({
            error: "db-0003",
            message: "Fail to find/update order"
        })
    }

    // Apply discount
    const timeDiff = (finishTime - order.orderTime) / (1000*60); // Timediff in minutes
    let discounted = false;
    if (timeDiff > 15){
        const discountedPrice = (order.totalCost * 0.8).toFixed(2);
        discounted = true;
        try {
            order = await Order.findOneAndUpdate({ _id: req.body.orderId },{"totalCost" : discountedPrice, "discounted": discounted})
        } catch (err) {
            console.log(err)
            console.log("Error when updating discount")
            res.status(503)
            return res.send({
                error: "db-0003",
                message: "Fail to find/update order"
            })
        }

    }

    res.status(200)
    res.send({
        discount    : discounted,
        returnedOrder : order
    })
}

// set an existing order to COMPLETE
const completeOrder = async (req, res) => {

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

    const updateObj = {
        "orderStatus": "COMPLETE"
    }

    let order;
    try {
        order = await Order.findOneAndUpdate({ _id: req.body.orderId }, updateObj, {new:true})
        if (!order) {
            console.log("ERROR: orderHandlerController.viewAllOutstanding: fail to find/update order")
            res.status(400)
            return res.send({
                error: "body-0002",
                message: "Order of that id does not exist in the system"
            })
        }
    } catch (err) {
        res.status(503)
        return res.send({
            error: "db-0003",
            message: "Fail to find/update order"
        })
    }

    res.status(200)
    res.send(order)
}

// export the functions
module.exports = {
    viewOrders,
    readyOrder,
    completeOrder
}
