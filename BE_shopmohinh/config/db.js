const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shopmohinh"
});

db.connect((err) => {
  if (err) {
    console.error(" Lỗi DB:", err);
  } else {
    console.log(" Kết nối MySQL thành công");
  }
});

module.exports = db;