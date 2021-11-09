const mongoose = require("mongoose")

// Schema for snacks
const snackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    img: { data: Buffer, contentType: String }
}, {
    collection: 'Snacks'
})

const Snack = mongoose.model("Snack", snackSchema)

module.exports = Snack