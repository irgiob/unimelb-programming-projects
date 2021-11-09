const mongoose = require("mongoose")
const vanRating = require("../../models/vanRating")

const Van = mongoose.model("VanAuth")

// Retrieve all vans in the system
const getAllVans = async (req, res) => {
    try {
        const vans = await Van.find()
        return res.send(vans)
    } catch (err) {
        console.log(err)
        res.status(400)
        return res.send("Database query failed")
    }
}

// Retrive a van of a specific ID
const getOneVan = async (req, res) => {

    let van;
    try {
        console.log(req.params.vendorId)
        van = await Van.findOne({ "_id": req.params.vendorId })
        if (van === null) {
            res.status(404)
            return res.send({
                error: "db-0001",
                message: "Van not found"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400)
        return res.send({
            error: "db-0001",
            message: "Failed to retrieve van"
        })
    }

    // Get rating 
    let ratings = [];
    try{
        ratings = await vanRating.find({vanId: req.params.vendorId})
    } catch (err) {
        res.status(500)
        return res.send({
            error: "db-0001",
            message : "Could not retrieve rating for van"
        })
    }

    // Calculate average rating for that van
    let total_rating = await ratings.reduce( (acc, cur) => acc + parseInt(cur.rating), 0 )
    let ave_rating = total_rating / ratings.length;
    res.status(200)
    return res.send({
        van: van,
        rating: ave_rating
    })
}

// Get customer's rating of a van
const getRating = async (req, res) => {

    if ( typeof req.params.vendorId === 'undefined'){
        res.status(400)
        return res.send({
            error: "body-0002",
            message: "vendorId lacks in params"
        })
    }
    // Get rating 
    let ratings = [];
    try{
        ratings = await vanRating.find({vanId: req.params.vendorId})
    } catch (err) {
        res.status(500)
        return res.send({
            error: "db-0001",
            message : "Could not retrieve rating for van"
        })
    }

    res.status(200)
    return res.send(ratings)

}

module.exports = {
    getAllVans,
    getOneVan,
    getRating
}