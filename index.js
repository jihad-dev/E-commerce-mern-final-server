const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware //

app.use(cors());
app.use(express.json());

// Ecommerce.Men

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ipn6sc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productsCollection = client.db("Ecommerce").collection("products");
    const cartsCollection = client.db("Ecommerce").collection("carts");

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // GET A SINGLE PRODUCT DATA //

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    // UPDATE A SINGLE PRODUCT QUANTITY //
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $inc: { quantity: +1 },
      };
      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // POST CART ITEM INFO TO THE DATABASE //
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await cartsCollection.insertOne(product);
      res.send(result);
    });

    // GET ALL PRODUCT CARTS DATA //

    app.get("/carts", async (req, res) => {
      const result = await cartsCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello E-commerce Application");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
