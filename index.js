const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


// middleawres 
app.use(cors())
app.use(express.json())

// verifier


// console.log(process.env.PORT);
// console.log(process.env.DB_USERNAME);
// console.log(process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6vknfdj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const connectDB = async () => {

    try {
        if (client.connect()) {
            console.log("____________connected____________");
            const servicesCollection = client.db('ashikurPhotographer').collection('services');
            const result = await servicesCollection.insertOne({ sercice: "Weeding photography" })
            console.log(result);
        }


    } catch (error) {
        console.log(error);
    }
}

// collections


connectDB();





















/*test server */


app.get("/", (req, res) => {
    res.json({
        message: "sucessfully running the server "
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running on ", process.env.PORT);
})