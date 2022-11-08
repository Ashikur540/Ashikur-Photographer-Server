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
            // const result = await servicesCollection.insertOne({ sercice: "Weeding photography" })
            // console.log(result);
        }


    } catch (error) {
        console.log(error);
    }
}

// collections
const servicesCollection = client.db('ashikurPhotographer').collection('services');


connectDB();

// load limited services data
app.get("/services", async (req, res) => {
    try {
        const query = {};
        const cursor = servicesCollection.find(query)
        const servicesData = await cursor.limit(3).toArray();
        if (servicesData) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: servicesData
            })
        }
        else {
            res.send({
                success: false,
                errMessage: `could not get the data!!`,

            })

        }

    }
    catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            error: error.message,
        })
    }
})
// load all services data
app.get("/services/all", async (req, res) => {
    try {
        const query = {};
        const cursor = servicesCollection.find(query)
        const servicesData = await cursor.toArray();
        if (servicesData) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: servicesData
            })
        }
        else {
            res.send({
                success: false,
                errMessage: `could not get the data!!`,

            })

        }

    }
    catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            error: error.message,
        })
    }
})




















/*test server */


app.get("/", (req, res) => {
    res.json({
        message: "sucessfully running the server "
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running on ", process.env.PORT);
})