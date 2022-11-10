const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken')
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

// jwt vweify
// const verifyJWT = (req, res, next) => {

//     const authHeader = (req.headers.authorization);
//     if (!authHeader) {
//         return res.status(401).send({
//             success: false,
//             message: 'unauthorized access'
//         })
//     }
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({
//                 success: false,
//                 message: 'unauthorized access'
//             })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }







app.post("/jwt", async (req, res) => {
    try {
        const currentUser = req.body;
        console.log(currentUser);
        // payload,secret,expiray(optional: 60,"10h", "2d")
        const token = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4h' });
        // send as json formate {}
        // res.send({ token }) OR 
        // res.json({ token })
        res.send({
            success: true,
            data: { token }
        })

    } catch (error) {
        res.send({
            succes: false,
            message: `Something wrong occured Invalid credential`

        })
    }

})















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
app.get("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: ObjectId(id) };
        // console.log(query);
        const reviewData = await reviewsCollection.findOne(query);
        // console.log(reviewData);
        if (reviewData) {
            res.send({
                success: true,
                message: `successfully loaded data`,
                data: reviewData
            })
        }
        else {
            res.send({
                success: false,
                errMessage: `could not get the data!!`,

            })

        }

    } catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            error: error.message,
        })
    }
})
// updat rviews
app.patch("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("review___________", req.body);
        const query = { _id: ObjectId(id) }
        const updateInfo = {
            $set: req.body
        }

        const result = await reviewsCollection.updateOne(query, updateInfo)
        if (result.matchedCount) {
            res.send({
                success: true,
                message: `Successfully updated`
            })
        }
        else {
            res.send({
                success: false,
                error: ` couldnot update `
            })
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.get("/services/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const query = { serviceId: id };

        // console.log(query);
        const cursor = reviewsCollection.find(query).sort({ postTime: -1 })

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

// add services 

app.post("/services/add", async (req, res) => {
    try {
        const serviceData = req.body;
        const result = await servicesCollection.insertOne(serviceData);;
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

    } catch (error) {
        console.log(error.message);
    }
})

// delete review based on id

app.delete("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: ObjectId(id) }
        const result = await reviewsCollection.deleteOne(query);
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `successfully deleted ${id}`,
                data: result
            })
        }
        else {
            res.send({
                success: false,
                message: `operation failed!`,

            })
        }
    }
    catch (error) {
        console.log(error.message);
    }
})


app.patch("/reviews/:id", async (req, res) => {
    try {
        const { id, reviewtext } = req.params;
        const query = { _id: ObjectId(id) }
        const updatedInfo = {
            $set: {
                reviewtext: reviewtext
            }
        }

        // Upsert option means that if you want top replace the new one with the old or not?\
        // when to use modified count and matched count ?
        const result = await ordersCollection.updateOne(query, updatedInfo);
        if (result.modifiedCount) {
            res.send({
                success: true,
                message: `Successfully updated`,
                data: result
            })
        }
        else {
            res.send({
                success: false,
                error: ` couldnot update !Operation failed  `
            })
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message
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