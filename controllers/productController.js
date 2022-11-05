const { ObjectId } = require("mongodb");
const createCollectin = require("./../mongoDB/mongoUtil");

const productsCollection = createCollectin("expressShop", "products");

// Read all Products
exports.getProducts = async (req, res) => {
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
};

// Read a single product
exports.getProduct = async (req, res) => {
  const id = req.params.id;

  const query = { _id: ObjectId(id) };

  const product = await productsCollection.findOne(query);

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

// Create new product
exports.createProduct = async (req, res) => {
  const product = req.body;

  const result = await productsCollection.insertOne(product);
  const newProduct = Object.assign({ _id: result.insertedId }, product);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
};

// Update a product
exports.updateProduct = async (req, res) => {
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
};

// Delete a product

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };

  const result = await productsCollection.deleteOne(query);

  res.status(204).json({
    status: "success",
    data: null,
  });
};
