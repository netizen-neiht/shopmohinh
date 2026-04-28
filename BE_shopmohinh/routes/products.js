const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// search
router.get("/search", productController.searchProducts);
// lấy tất cả sản phẩm
router.get("/", productController.getProducts);

//THÊM DÒNG NÀY (QUAN TRỌNG NHẤT)
router.get("/:id", productController.getProductById);

module.exports = router;

