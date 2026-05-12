import { useLocation, useNavigate } from "react-router-dom";

function MomoPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { amount, orderId } = location.state || {};

  const handlePaid = async () => {
    try {
      await fetch("http://localhost:3000/api/orders/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
        }),
      });

      // 👉 xoá giỏ hàng
      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.removeItem(`cart_${user.id}`);

      alert("🎉 Thanh toán thành công!");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Lỗi thanh toán");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Thanh toán MoMo</h1>

      <p>Số tiền: {amount?.toLocaleString()} VND</p>

      {/* 🔥 QR DEMO */}
      <img
        src={`https://img.vietqr.io/image/momo-0900000000-compact.png?amount=${amount}&addInfo=ThanhToan`}
        alt="QR MoMo"
        style={{ width: "300px", marginTop: "20px" }}
      />

      <p>📱 Mở app MoMo và quét mã để thanh toán</p>

      <button
        onClick={handlePaid}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#e91e63",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Tôi đã thanh toán
      </button>

      <br /><br />

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Về trang chủ
      </button>
    </div>
  );
}

export default MomoPayment;