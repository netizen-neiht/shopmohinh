import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Checkout.css";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "cod",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = getUser();

    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      navigate("/cart");
      return;
    }

    setCartItems(cart);

    setForm({
      name: user.full_name || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      payment: "cod",
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Không được để trống";

    if (!form.phone.trim()) err.phone = "Không được để trống";
    else if (!/^0\d{9}$/.test(form.phone))
      err.phone = "SĐT phải 10 số và bắt đầu bằng 0";

    if (!form.email.trim()) err.email = "Không được để trống";
    else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
      err.email = "Email phải dạng abc@gmail.com";

    if (!form.address.trim()) err.address = "Không được để trống";

    return err;
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = () => {
    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});

    alert("🎉 Đặt hàng thành công!");

    const user = getUser();
    localStorage.removeItem(`cart_${user.id}`);

    navigate("/");
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">🧾 Thanh toán</h1>

      <div className="cart-grid">

        {/* LEFT */}
        <div className="cart-left">
          <div className="checkout-form-box">
            <h2>Thông tin nhận hàng</h2>

            {/* NAME */}
            <div className="input-group">
              <input name="name" value={form.name} onChange={handleChange} placeholder=" " />
              <label>Họ và tên</label>
            </div>
            {errors.name && <p className="error">{errors.name}</p>}

            {/* PHONE */}
            <div className="input-group">
              <input name="phone" value={form.phone} onChange={handleChange} placeholder=" " />
              <label>Số điện thoại</label>
            </div>
            {errors.phone && <p className="error">{errors.phone}</p>}

            {/* EMAIL */}
            <div className="input-group">
              <input name="email" value={form.email} onChange={handleChange} placeholder=" " />
              <label>Email</label>
            </div>
            {errors.email && <p className="error">{errors.email}</p>}

            {/* ADDRESS */}
            <div className="input-group">
              <input name="address" value={form.address} onChange={handleChange} placeholder=" " />
              <label>Địa chỉ</label>
            </div>
            {errors.address && <p className="error">{errors.address}</p>}

            <p>Phương thức thanh toán</p>

            {/* PAYMENT */}
            <div className="payment-method">
              <label className={`payment-option ${form.payment === "cod" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  onChange={handleChange}
                />
                COD
              </label>

              <label className={`payment-option ${form.payment === "momo" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={form.payment === "momo"}
                  onChange={handleChange}
                />
                MoMo
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <h2>Tổng đơn hàng</h2>

          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <img
                src={`http://localhost:3000/uploads/${item.image}`}
                alt={item.name}
              />

              <div className="summary-info">
                <p>{item.name}</p>
                <p>x{item.quantity}</p>
              </div>

              <div className="summary-price">
                {(item.price * item.quantity).toLocaleString()} VND
              </div>
            </div>
          ))}

          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{total.toLocaleString()} VND</span>
          </div>

          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()} VND</span>
          </div>

          {/* 🔥 BUTTONS */}
          <div className="checkout-actions">
            <button
              className="back-btn"
              onClick={() => navigate("/cart")}
            >
              ← Quay về giỏ hàng
            </button>

            <button
              className="checkout-btn"
              onClick={handleSubmit}
            >
              Xác nhận đặt hàng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;