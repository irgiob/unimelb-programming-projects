const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors= require('cors')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser("404-INC-SECRET"))
app.set("view engine", "ejs"); // Temporary, will use React later

const corsOptions = {
    // origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// App Routers
require("./models")
const uploadSnackRouter = require("./routes/utilities/uploadSnackRouter")
const customerRouter = require("./routes/customer/customerRouter")
const vendorRouter = require("./routes/vendor/vendorRouter")


// Routes
app.get('/', (req, res) => {
    res.send("<h1> 404incorporated WEBIT Server")
});

// Customer Route
app.use('/customer', customerRouter);

// Vendor Route
app.use('/vendor', vendorRouter);

// Route to upload snacks
app.use('/uploadSnack', uploadSnackRouter);

app.listen(process.env.PORT || port, () => {
    console.log("Listening on port 3000")
});

module.exports = app;