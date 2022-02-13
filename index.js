const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const PORT = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.get("/", (req, res) => res.send("server side of HandCraft"));

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const servicesCollection = client.db("HandCraft").collection("services");
    const ordersCollection = client.db("HandCraft").collection("orders");
    const reviewsCollection = client.db("HandCraft").collection("review");
    const usersCollection = client.db("HandCraft").collection("users");

    //get methods
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.json(result);
    });
    app.get("/servicesLimited", async (req, res) => {
      const result = await servicesCollection.find({}).limit(6).toArray();
      res.json(result);
    });
    app.get("/service/:id", async (req, res) => {
      const result = await servicesCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    app.get("/myOrder/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.json(result);
    });

    // post methods
    app.post("/order", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    });

    app.post("/addReview", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/addUserToDb", async (req, res) => {
      console.log(req.body);
      console.log(req.files);

      // const result = await usersCollection.insertOne(req.body);
      // res.json(result);
    });

    //delete methods
    app.delete("/cancelOrder/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      g;
      res.json(result);
    });
  } catch {
    // await client.close();
  }
}

app.listen(PORT, () => {});

run().catch(console.dir);
