const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const reviewsCollection = client.db('ashikurPhotographer').collection('reviews')

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
// get service data based on id
app.get("/services/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: ObjectId(id) };
        const serviceData = await servicesCollection.findOne(query);
        if (serviceData) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: serviceData
            })
        }
        else {
            res.send({
                success: false,
                errMessage: `could not get the data!!`,

            })

        }
        // console.log(serviceData);
    } catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            error: error.message,
        })
    }
})

app.get("/services/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const query = { serviceId: id };
        // console.log(query);
        const cursor = reviewsCollection.find(query)
        const reviewsData = await cursor.toArray();
        // console.log(reviewsData);
        if (reviewsData) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: reviewsData
            })
        }
        else {
            res.send({
                success: false,
                errMessage: `could not get the data!!`,

            })

        }
        // console.log(serviceData);
    } catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            error: error.message,
        })
    }
})



// get email based reviews data 
app.get("/reviews", async (req, res) => {
    try {
        const { email } = req.query;
        // console.log("from query", email);
        let query = {}
        if (email) {
            // filter through email field and value is email from query 
            query = { reviewerEmail: email }
        }
        // console.log(query);
        const cursor = reviewsCollection.find(query);
        const reviewsData = await cursor.toArray();
        // console.log(reviewsData);
        res.send({
            success: true,
            message: `Successfully loaded the data`,
            data: reviewsData
        })

    }

    catch (error) {
        res.send({
            success: false,
            error: error.message,
        })
    }
})







// create new review based on specific id service


app.post("/services/:id/reviews/add", async (req, res) => {

    try {
        const reviewData = req.body;
        // console.log("from client", reviewData);
        const result = await reviewsCollection.insertOne(reviewData);
        if (result.insertedId) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: result
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