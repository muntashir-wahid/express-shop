const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middlewares

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Database setup

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjjckmu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Route Handlers

const run = async () => {
  try {
    const productsCollection = client.db("expressShop").collection("products");

    // Read all products data

    app.get("/api/v1/products", async (req, res) => {
      const query = {};

      const products = await productsCollection
        .find(query)
        .map((product) => {
          return {
            _id: product._id,
            productName: product.productName,
            price: product.price,
          };
        })
        .toArray();

      const count = await productsCollection.estimatedDocumentCount();

      res.status(200).json({
        status: "success",
        count,
        data: {
          products,
        },
      });
    });

    // Read a single product

    app.get("/api/v1/products/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const product = await productsCollection.findOne(query);
      console.log(product);

      res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    });

    // Create new product

    app.post("/api/v1/products", async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);
      const newProduct = Object.assign({ _id: result.insertedId }, product);

      res.status(201).json({
        status: "success",
        data: {
          product: newProduct,
        },
      });
    });

    // Update a product

    app.patch("/api/v1/products/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: req.body,
      };

      const result = await productsCollection.updateOne(filter, updateDoc);

      res.status(200).json({
        status: "success",
        data: {
          _id: id,
          isUpdated: result.acknowledged,
          modifiedCount: result.modifiedCount,
        },
      });
    });

    // Delete a product

    app.delete("/api/v1/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await productsCollection.deleteOne(query);

      res.status(204).json({
        status: "success",
        data: null,
      });
    });
  } finally {
    // console.log("all done")
  }
};

run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello form the Express shop",
  });
});

// Start the server

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express shop is listening on port ${port}`);
});
