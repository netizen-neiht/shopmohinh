const db = require("../config/db");

// Lấy danh sách customer
exports.getCustomers = (req, res) => {
  const sql = `
    SELECT id, username, email, phone, full_name, created_at
    FROM users
    WHERE role = 'customer'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ? AND role = 'customer'";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Không tìm thấy user hoặc không được phép xóa"
      });
    }

    res.json({ message: "Xóa thành công" });
  });
};

// Cập nhật user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, email, full_name, phone, password } = req.body;

  // ===== VALIDATE =====
  if (!username || username.trim() === "") {
    return res.status(400).json({
      message: "Username không được để trống"
    });
  }

  if (!full_name || full_name.trim() === "") {
    return res.status(400).json({
      message: "Họ tên không được để trống"
    });
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "SĐT phải gồm 10 số và bắt đầu bằng số 0"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email không đúng định dạng"
    });
  }

  let sql = "";
  let values = [];

  if (password && password.trim() !== "") {
    sql = `
      UPDATE users
      SET username = ?, email = ?, full_name = ?, phone = ?, password = ?
      WHERE id = ? AND role = 'customer'
    `;
    values = [username.trim(), email.trim(), full_name.trim(), phone, password, id];
  } else {
    sql = `
      UPDATE users
      SET username = ?, email = ?, full_name = ?, phone = ?
      WHERE id = ? AND role = 'customer'
    `;
    values = [username.trim(), email.trim(), full_name.trim(), phone, id];
  }

  db.query(sql, values, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Số điện thoại hoặc email đã tồn tại"
        });
      }

      return res.status(500).json(err);
    }

    res.json({ message: "Cập nhật thành công" });
  });
};

//lấy user theo id
exports.getUserById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, username, email, full_name, phone
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy user"
      });
    }

    res.json(result[0]);
  });
};