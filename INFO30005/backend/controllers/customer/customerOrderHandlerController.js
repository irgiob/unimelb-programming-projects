// initialize requirements
const mongoose = require("mongoose")

require("../../models/index")
const Snack = mongoose.model("Snack")
const Order = mongoose.model("Order")
const Van = mongoose.model("VanAuth")
const Customer = mongoose.model("Customer")
const VanRating = mongoose.model("VanRating")
const Counter = mongoose.model("Counter")

// Send order to the database
const createOrder = async (req, res) => {

    // Check if incoming request has all the necessary fields in order to execute the function
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

    // Checks if the van exists and its open
    let van = {};
    try {
        van = await Van.findById(req.body.orderedFrom)

        // Checks if the van exists
        if (!van) {
            res.status(400)
            return res.send({
                error: "order-0002",
                message: "Van does not exist"
            })
        }

        // Checks if the van is opened
        if (van.status === "CLOSED" ){
            res.status(503)
            return res.send({
                error: "order-0001",
                message: "Van is closed, unable to create order"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not find van in the database"
        })
    }


    // Updates cart to be empty
    const emptyCart = { "cart" : {} };
    let updatedCustomer = {};
    try {
        updatedCustomer = await Customer.findOneAndUpdate(
            {"_id": req.headers.login},
            emptyCart,
            {new:true}
        )
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0003",
            message: "Fail to update customer's cart to empty"
        })
    }

    // Gets the order number
    let orderNumber
    let counterDoc ;
    const orderCounterStr = "OrderCounter";

    try {
        counterDoc = await Counter.findOne({"name":orderCounterStr})
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not find orderNumber in the database"
        })
    }

    orderNumber = counterDoc.count

    // Updates the counter for order number
    try {
        counterDoc = await Counter.findOneAndUpdate({"name":orderCounterStr},{count:orderNumber+1})
    } catch(err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not find orderNumber in the database"
        })
    }

    // Creates the order
    const cart = JSON.parse(JSON.stringify(customer.cart));
    const newOrderObj = {
        orderedFrom: req.body.orderedFrom,
        orderedBy: customer._id,
        name: customer.firstName,
        snacks: cart,
        orderTime: Date.now(),
        totalCost: await calculateCost(cart),
        orderNumber: orderNumber,
        vanName : van.vendorName
    }

    console.log(newOrderObj)

    let newOrder;
    try {
        newOrder = await Order.create(newOrderObj)
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({   
            error: "db-0002",
            message: "Error when inserting order document to databse"
        })
    }

    res.status(200)
    return res.send(newOrder)

}

// calculates the cost of a map of snacks and their associated quantities
const calculateCost = async (snacks) => {
    console.log(snacks)
    let totalCost = 0
    let snack = {}
    for (const snackId in snacks) {
        try {
            snack = await Snack.findById(snackId)
            totalCost += snack.price * snacks[snackId]
        } catch (err) {
            console.log(err)
            return 0
        }
    }
    // return the total cost
    return totalCost
}


// Get order from a customer
const getOrder = async (req, res)=> {

    // add optional parameters (vendorId and status) to search query
    let customerId = req.query.customerId
    if ( typeof customerId === 'undefined'){
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "customerId is empty"
        })
    }

    // Obtain and return order by that Id
    try {
        const orders = await Order.find({"orderedBy" : customerId})
        res.status(200)
        return res.send(orders)
    } catch (err) {
        console.log(err)
        res.status(503)
        return res.send({
            error: "db-0001",
            message: "Could not retrieve orders of customer from database"
        })
    }

}

// Sets the order status to cancel OR deletes it from the database TBD
const cancelOrder = async (req, res) => {

    // Check if login cookie exists
    if (req.headers.login === undefined) {
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before cancelling order"
        })
    }

    if (!req.body) {
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "Body is empty"
        })
    } 
    try {

        // Obtain order and update status to cancel
        const customer = await Order.findOneAndUpdate(
            {"_id": req.body.orderId},
            {orderStatus: "CANCELLED"},
            {new:true}
        )

        if (!customer){
            res.status(404)
            return res.send({
                error: "auth-0004",
                message: "Invalid customerId"
            })
        }

        res.status(200)
        return res.send(customer._id);

    } catch(err) {

        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not find order in the database to cancel"
        })

    }

            
}

// Overwrite an order
const overwriteOrder = async (req, res) => {
    // Check if login cookie exists
    if (req.headers.login === undefined) {
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before cancelling order"
        })
    }

    if (!req.body) {
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "Body is empty"
        })
    } 

    try {
        // Checks if associated customer exists
        const customer = await Customer.findOne({"_id": req.headers.login});
        if (!customer){
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

    let newCart
    console.log(req.body.updateSnack);
    try {
        newCart = await JSON.parse(JSON.stringify(req.body.updateSnack));
    } catch (error) {
        console.log(error)
        res.status(400)
        return res.send({
            error : "json-0001",
            message: "Unable to parse, make sure its a Map with snackID as key and quantity as value"
        })
    }

    let order;
    // Updates order
    try {
         order = await Order.findOneAndUpdate(
            {"_id": req.body.orderId},
            {"snacks": newCart, "totalCost": await calculateCost(newCart), orderTime : Date.now() },
            {new:true}
        )

        if (!order){
            res.status(404)
            return res.send({
                error: "order-0003",
                message: "Order to be updated does not exists"
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not retrieve data from database"
        })
    }

    console.log("OVERWRITE ORDER")
    console.log(order)
    res.status(200)
    return res.send(order)

}



// Allow customer to rate the van
const rateVan = async (req, res) => {
    /* 
    Body => 
        vanId : id of van to be
        rating : number from 1 to 5
        message :  optional
    */ 

    // Authenticate user
    if (req.headers.login === undefined) {
        res.status(503)
        return res.send({
            error: "auth-0003",
            message: "Please login before cancelling order"
        })
    }

    try {
        // Checks if associated customer exists
        const customer = await Customer.findOne({"_id": req.headers.login});
        if (!customer){
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

    // Checks if body is correct
    if (!req.body) {
        res.status(400)
        return res.send({
            error: "body-0001",
            message: "Body is empty"
        })
    } 
    else if ( req.body.rating > 5 || req.body.rating < 0 ){
        res.status(400)
        return res.send({
            error: "body-0002",
            message: "Please ensure that rating is between range of 0 to 5!"
        })
    }

    // Creates object for the Van_Rating, message is optional
    ratingObj = {
        vanId : req.body.vanId,
        rating : req.body.rating,
    }
    if ( req.body.message ){
        ratingObj.message = req.body.message
    }

    // Create rating document in the database
    let rating;
    try {
        rating = await VanRating.create(ratingObj)
    } catch(err) {
        console.log(err)
        res.status(500)
        return res.send({
            error : "db-0002",
            message : "Fail to create rating document"
        })
    }
    res.status(200)
    return res.send(rating)
}


// export the createOrder function
module.exports = {
    createOrder,
    calculateCost,
    getOrder,
    cancelOrder,
    overwriteOrder,
    rateVan
}
