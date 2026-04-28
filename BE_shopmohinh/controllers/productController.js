const db = require("../config/db");

// 🔥 Hàm bỏ dấu + lowercase
const removeVietnameseTones = (str) => {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

// ============================
// LẤY TẤT CẢ SẢN PHẨM
// ============================
exports.getProducts = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      pt.name AS type_name,
      bg.name AS grade_name
    FROM products p
    LEFT JOIN product_types pt ON p.type_id = pt.id
    LEFT JOIN bandai_grades bg ON p.grade_id = bg.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.json(result);
  });
};

// ============================
// LẤY CHI TIẾT 1 SẢN PHẨM
// ============================
exports.getProductById = (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      p.*, 
      pt.name AS type_name,
      bg.name AS grade_name
    FROM products p
    LEFT JOIN product_types pt ON p.type_id = pt.id
    LEFT JOIN bandai_grades bg ON p.grade_id = bg.id
    WHERE p.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(result[0]);
  });
};

// ============================
// 🔥 SEARCH KHÔNG DẤU + KHÔNG PHÂN BIỆT HOA THƯỜNG
// ============================
exports.searchProducts = (req, res) => {
  let keyword = req.query.q || "";
  const keywordNormalized = removeVietnameseTones(keyword.trim());

  if (!keywordNormalized) {
    return res.json([]);
  }

  const sql = `
    SELECT 
      p.*, 
      pt.name AS type_name,
      bg.name AS grade_name
    FROM products p
    LEFT JOIN product_types pt ON p.type_id = pt.id
    LEFT JOIN bandai_grades bg ON p.grade_id = bg.id
  `;

  console.log("SEARCH:", keywordNormalized);

  db.query(sql, (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    // 🔥 LỌC BẰNG JS (KHÔNG DẤU)
    const filtered = result.filter(p => {
      const name = removeVietnameseTones(p.name);
      const type = removeVietnameseTones(p.type_name);
      const grade = removeVietnameseTones(p.grade_name);

      return (
        name.includes(keywordNormalized) ||
        type.includes(keywordNormalized) ||
        grade.includes(keywordNormalized)
      );
    });

    res.json(filtered);
  });
};