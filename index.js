const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


// middleawres 
app.use(cors())
app.use(express.json())

// verifier


// console.log(process.env.PORT);

const connectDB = async () => {

    try {

    } catch (error) {

    }
}




















/*test server */


app.get("/", (req, res) => {
    res.json({
        message: "sucessfully running the server "
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running on ", process.env.PORT);
})