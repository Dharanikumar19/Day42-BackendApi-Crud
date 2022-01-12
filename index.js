const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb://localhost:27017/batch29wd"

app.use(express.json());
app.use(cors({
    origin: "*"
}))

//get all users
app.get("/users", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL)

        let db = connection.db("batch29wd")
        let users = await db.collection("users").find({}).toArray()
        await connection.close();
        res.json(users)
    } catch (error) {
        console.log(error)
    }

})

//get a single user
app.get("/user/:id", async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("batch29wd");
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("users").findOne({ _id: objId })
        await connection.close()
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({ message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

// create a user
app.post("/create-user", async (req, res) => {

    try {
        //connect to db
        let connection = await mongoClient.connect(URL)
        // select db
        let db = connection.db("batch29wd")
        // select collection and do operation
        await db.collection("users").insertOne(req.body)
        await connection.close();
        res.json({ message: "user added" })
    } catch (error) {
        console.log(error)
    }
})

//update user

app.put("/user/:id",async function (req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("batch29wd");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").findOneAndUpdate({_id : objId},{$set : req.body})
        await connection.close()
        res.json({message : "user updated"})
    } catch (error) {
        console.log(error)
    }
})

//delete user
app.delete("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("batch29wd");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
});



app.listen(3000)