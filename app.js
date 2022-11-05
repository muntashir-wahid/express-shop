const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const productRouter = require("./routes/productRoutes");

const app = express();

// Middlewares

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const run = async () => {
  try {
    app.use("/api/v1/products", productRouter);
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
