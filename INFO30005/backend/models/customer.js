const mongoose = require("mongoose")

// Schema for snacks
const authSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.Map, required: true }
}, {
    collection: 'Customer'
})

const Customer = mongoose.model("Customer", authSchema)

module.exports = Customer