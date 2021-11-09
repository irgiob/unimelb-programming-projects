const mongoose = require("mongoose")

// Schema for snacks
const vanRatingSchema = new mongoose.Schema({
    vanId : { type: String, required: true },
    rating : {type: Number, required: true},
    message : { type: String }
}, {
    collection: 'Van_Rating'
})

const vanRating = mongoose.model("VanRating", vanRatingSchema)

module.exports = vanRating