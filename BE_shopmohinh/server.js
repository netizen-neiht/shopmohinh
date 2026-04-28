console.log("🔥 FILE SERVER ĐANG CHẠY");

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CORS =====
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC IMAGE =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== IMPORT ROUTES =====
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth"); // 🔥 THÊM DÒNG NÀY

// ===== USE ROUTES =====
app.use("/products", productRoutes);
app.use("/", authRoutes); // 🔥 THÊM DÒNG NÀY

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});