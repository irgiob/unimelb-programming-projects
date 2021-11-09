const mongoose = require("mongoose")

const Snack = mongoose.model("Snack")

const fs = require('fs');
const sharp = require('sharp')

// GET handler to upload new snack to the database
const uploadGetSnack = async (req, res) => {
    await Snack.find({}, (err, items) => {
        if (err) {
            console.log("ERROR")
            res.status(500).send('Error hace occured')
        }
        else {
            console.log(items)
            res.render('uploadSnackPage', { items: items })
        }
    })
}

// POST handler to upload new snacks to the database
const uploadPostSnack = async (req, res, next) => {
    console.log(req.body)
    console.log(req.file)

    // Resizes image before uploading
    await sharp(fs.readFileSync(req.file.path))
        .resize({ width: 615, height: 615 })
        .toBuffer()
        .then(data => {

            // Upload image to mongodb
            const obj = {
                name: req.body.name,
                description: req.body.desc,
                price: req.body.price,
                img: {
                    data: data,
                    contentType: 'image/png'
                },
            }

            Snack.create(obj, (err, item) => {
                if (err) {
                    res.status(500)
                    res.send({
                        error: "db-0002",
                        message: "Could not create document for snack"
                    })
                    console.log("ERROR: uploadSnackController.uploadPostSnack: Could not create document for snack")
                }
                else {
                    res.redirect('back')
                }
            })
        })
        .catch(err => {
            res.status(500)
            res.send({
                error: "img-0001",
                message: "Could not process image properly"
            })
        })
}


module.exports = {
    uploadGetSnack,
    uploadPostSnack
}