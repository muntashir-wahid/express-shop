const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
