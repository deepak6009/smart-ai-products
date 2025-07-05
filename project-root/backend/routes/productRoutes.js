const express = require("express");
const router = express.Router();
const { addProduct, listProducts } = require("../controllers/productController");

// POST /api/products/add → for creating product
router.post("/add", addProduct);

// GET /api/products/list/:admin_id → for viewing products
router.get("/list/:admin_id", listProducts);

module.exports = router;
