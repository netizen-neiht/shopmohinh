const db = require("../config/db");

// 🔥 Lấy tất cả đơn hàng (admin)
exports.getAllOrders = (req, res) => {
  const sql = `
    SELECT o.*, u.full_name, u.phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// 🔄 Cập nhật trạng thái
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
};