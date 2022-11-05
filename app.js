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
