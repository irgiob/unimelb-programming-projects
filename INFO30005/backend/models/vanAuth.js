const mongoose = require("mongoose")

// Schema for the van
const vanAuthSchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    locationDescription: { type: String, default: null },
    geolocation: { type: [Number], default: null },
    status: { type: String, required: true, default: "CLOSED" },
    password: {type: String, required: true}
}, {
    collection: 'Vans-Auth',
})

const VanAuth = mongoose.model("VanAuth", vanAuthSchema)

module.exports = VanAuth