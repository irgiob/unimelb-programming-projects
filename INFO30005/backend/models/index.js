const mongoose = require('mongoose');
require('dotenv').config()

// set MongoDB variables
const database_name = "App"
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const connection_string = `mongodb+srv://${username}:${password}@cluster0.pwynp.mongodb.net/${database_name}?retryWrites=true&w=majority`

// connect to mongoDB database
mongoose.connect(connection_string,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
)
const db = mongoose.connection

// handle success and failure connection cases
db.on("error", err => {
    console.error(err);
    process.exit(10)
})
db.once("open", async () => {
    console.log("Mongo connection started on" + db.host + ":" + db.port)
})

// connect models
// require("./van")
require("./snack")
require("./order")
require("./customer")
require("./vanAuth")
require("./vanRating")
require('./orderCounter')
