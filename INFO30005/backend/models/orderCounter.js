const mongoose = require("mongoose")

// Schema for snacks
const counterSchema = new mongoose.Schema({
    name: {type:String, required: true},
    count : {type: Number, required: true, default: 0}
}, {
    collection: 'Counter'
})

const Counter = mongoose.model("Counter", counterSchema)

module.exports = Counter