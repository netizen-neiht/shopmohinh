const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

// ================= UPLOAD CONFIG =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// 🔍 SEARCH
router.get("/search", productController.searchProducts);

// 📦 LẤY TẤT CẢ
router.get("/", productController.getProducts);

// 📦 LẤY 1
router.get("/:id", productController.getProductById);

// ================= CRUD =================

// 🔥 CREATE (ảnh chính + nhiều ảnh phụ)
router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },   // ảnh chính
    { name: "images", maxCount: 10 }, // ảnh phụ
  ]),
  productController.createProduct
);

// 🔥 UPDATE (cũng hỗ trợ nhiều ảnh)
router.post(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  productController.updateProduct
);

// 🔥 DELETE
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;