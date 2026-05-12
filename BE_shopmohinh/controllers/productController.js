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
  const { type, grade, sort } = req.query;

  let sql = `
    SELECT 
      p.*, 
      pt.name AS type_name,
      bg.name AS grade_name
    FROM products p
    LEFT JOIN product_types pt ON p.type_id = pt.id
    LEFT JOIN bandai_grades bg ON p.grade_id = bg.id
    WHERE 1=1
  `;

  const params = [];

  // ===== FILTER =====
  if (type) {
    if (type === "Figure") {
      sql += " AND pt.name LIKE '%Figure%'";
    } else {
      sql += " AND LOWER(pt.name) LIKE LOWER(?)";
      params.push(`%${type}%`);
    }
  }

  if (grade) {
    sql += " AND LOWER(bg.name) LIKE LOWER(?)";
    params.push(`%${grade}%`);
  }

  // ===== SORT =====
  if (sort === "asc") {
    sql += " ORDER BY p.price ASC";
  } else if (sort === "desc") {
    sql += " ORDER BY p.price DESC";
  } else {
    sql += " ORDER BY p.id DESC";
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("GET PRODUCTS ERROR:", err);
      return res.status(500).json(err);
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
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }

    const product = result[0];

    // 🔥 lấy ảnh phụ
    db.query(
      "SELECT images_more FROM product_images WHERE product_id = ?",
      [id],
      (err2, images) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: "Lỗi ảnh" });
        }

        product.images = images.map(i => i.images_more);

        res.json(product);
      }
    );
  });
};

// ============================
// SEARCH KHÔNG DẤU
// ============================
exports.searchProducts = (req, res) => {
  let keyword = req.query.q || "";
  const keywordNormalized = removeVietnameseTones(keyword.trim());

  if (!keywordNormalized) return res.json([]);

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
      console.error("SEARCH ERROR:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

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

// ============================
// THÊM SẢN PHẨM
// ============================
exports.createProduct = (req, res) => {
  const { name, price, description, type_id, grade_id } = req.body;

  const mainImage = req.files["image"]
    ? req.files["image"][0].filename
    : null;

  const subImages = req.files["images"] || [];

  const sql = `
    INSERT INTO products (name, price, description, image, type_id, grade_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, price, description, mainImage, type_id || null, grade_id || null],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const productId = result.insertId;

      // 🔥 lưu ảnh phụ
      if (subImages.length > 0) {
        const values = subImages.map(img => [productId, img.filename]);

        db.query(
          "INSERT INTO product_images (product_id, images_more) VALUES ?",
          [values]
        );
      }

      res.json({ message: "Thêm sản phẩm thành công" });
    }
  );
};

// ============================
// XOÁ
// ============================
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ message: "Lỗi xoá" });
    }

    res.json({ message: "Xoá thành công" });
  });
};

// ============================
// SỬA
// ============================
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, description, type_id, grade_id } = req.body;

  let sql = `
    UPDATE products 
    SET name=?, price=?, description=?, type_id=?, grade_id=?
  `;

  const values = [
    name,
    price,
    description,
    type_id || null,
    grade_id || null
  ];

  // ✅ FIX: dùng req.files thay vì req.file
  if (req.files["image"]) {
    sql += ", image=?";
    values.push(req.files["image"][0].filename);
  }

  sql += " WHERE id=?";
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);

    // 🔥 THÊM ẢNH PHỤ MỚI
    const subImages = req.files["images"] || [];

    if (subImages.length > 0) {
      const values = subImages.map(img => [id, img.filename]);

      db.query(
        "INSERT INTO product_images (product_id, images_more) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: "Cập nhật + thêm ảnh phụ thành công" });
        }
      );
    } else {
      res.json({ message: "Cập nhật thành công" });
    }
  });
};