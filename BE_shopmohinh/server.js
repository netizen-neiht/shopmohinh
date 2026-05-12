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

// ===== BODY =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== ROUTES =====
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/users");

// 🔥 CHUẨN HOÁ API
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// ===== TEST =====
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server OK",
    time: new Date()
  });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API không tồn tại"
  });
});