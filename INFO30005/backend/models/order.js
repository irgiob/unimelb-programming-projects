const mongoose = require("mongoose")

// Schema for orders
const orderSchema = new mongoose.Schema({
    orderStatus: { type: String, required: true, default: "PENDING" },
    orderedFrom: { type: String, required: true },
    orderedBy: { type: String, required: true },
    orderTime: { type: Date, required: true, default: Date.now() },
    finishTime: { type: Date, default: null },
    snacks: { type: mongoose.Schema.Types.Map, required: true },
    totalCost: { type: Number, required: true },
    name: {type: String, required: true},
    orderNumber: {type:Number, required: true},
    discounted: {type:Boolean, default: false},
    vanName: {type:String, required:true}
}, {
    //TODO: Switch this back to Orders after deliverable 2 marked
    collection: 'Orders'
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order