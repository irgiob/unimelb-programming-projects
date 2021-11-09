const mongoose = require("mongoose")
const Snack = mongoose.model("Snack")

// View entire menu
const viewMenu = async (req, res) => {

    let snacks = []
    try {
        snacks = await Snack.find({})
    } catch (err) {
        console.log("ERROR: menuController.viewMenu: menu not found")
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not find Menu"
        })
    }
    res.status(200)
    return res.send(snacks)
}

// View snack detail 
const viewSnack = async (req, res) => {

    let snack = {}
    try {
        snack = await Snack.findById(req.params.snackId)
    } catch (err) {
        console.log("ERROR: menuController.viewMenu: menu not found")
        console.log(err)
        res.status(500)
        return res.send({
            error: "db-0001",
            message: "Could not get snack details as snack does not exist"
        })
    }
    res.status(200)
    return res.send(snack)
}


module.exports = {
    viewMenu,
    viewSnack
}