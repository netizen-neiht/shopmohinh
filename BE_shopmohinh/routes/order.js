const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ================= GET ALL ORDERS =================
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM orders ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.error("GET ORDERS ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json(results);
    }
  );
});


// ================= GET ORDER DETAIL =================
router.get("/detail", (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.total_price,
      o.status,
      oi.product_id,
      p.name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DETAIL ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


// ================= ADMIN: GET ALL ORDERS =================
router.get("/admin", (req, res) => {
  const sql = `
    SELECT 
      o.id,
      o.user_id,
      u.full_name,
      u.phone,
      o.total_price,
      o.status,
      o.order_date
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("ADMIN ORDERS ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


// ================= UPDATE ORDER STATUS =================
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("UPDATE STATUS ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});


// ================= CREATE ORDER =================
router.post("/create", (req, res) => {
  const { user_id, items, total, payment_method } = req.body;

  console.log("📦 BODY:", req.body);

  if (!user_id) {
    return res.status(400).json({ error: "Thiếu user_id" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Giỏ hàng rỗng" });
  }

  db.query(
    "INSERT INTO orders (user_id, status, total_price) VALUES (?, ?, ?)",
    [user_id, "pending", total],
    (err, orderResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      const orderId = orderResult.insertId;
      let count = 0;

      items.forEach((item) => {
        if (!item.product_id) {
          return res.status(400).json({ error: "product_id undefined" });
        }

        db.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ error: err2.message });
            }

            count++;

            if (count === items.length) {
              db.query(
                "INSERT INTO payments (order_id, method, status) VALUES (?, ?, ?)",
                [
                  orderId,
                  payment_method,
                  payment_method === "cod" ? "pending" : "unpaid",
                ],
                (err3) => {
                  if (err3) {
                    console.error(err3);
                    return res.status(500).json({ error: err3.message });
                  }

                  res.json({ success: true, orderId });
                }
              );
            }
          }
        );
      });
    }
  );
});


// ================= PAY =================
router.post("/pay", (req, res) => {
  const { order_id } = req.body;

  db.query(
    "UPDATE payments SET status='paid', paid_at=NOW() WHERE order_id=?",
    [order_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        "UPDATE orders SET status='completed' WHERE id=?",
        [order_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          res.json({ success: true });
        }
      );
    }
  );
});


// ================= GET ORDER ITEMS BY ID (NÂNG CAO) =================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      oi.*, p.name, p.image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("ORDER DETAIL ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


module.exports = router;