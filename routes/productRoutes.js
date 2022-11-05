const express = require("express");
const controllers = require("./../controllers/productController");

const router = express.Router();

router.route("/").get(controllers.getProducts).post(controllers.createProduct);
router
  .route("/:id")
  .get(controllers.getProduct)
  .patch(controllers.updateProduct)
  .delete(controllers.deleteProduct);

module.exports = router;
