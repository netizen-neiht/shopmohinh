const db = require("../config/db");

// ================= REGISTER =================
exports.register = (req, res) => {
  const { full_name, email, phone, username, password } = req.body;

  const sql = `
    INSERT INTO users 
    (username, password, role, full_name, email, phone_number)
    VALUES (?, ?, 'customer', ?, ?, ?)
  `;

  db.query(
    sql,
    [username, password, full_name, email, phone],
    (err) => {
      if (err) {
        console.error(err);

        // ❌ trùng username/email
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Username hoặc Email đã tồn tại"
          });
        }

        return res.status(500).json({ message: "Lỗi server" });
      }

      res.json({ message: "Đăng ký thành công" });
    }
  );
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = result[0];

    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  });
};