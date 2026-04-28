import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = getUser();

    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }

    const data = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    setCartItems(data);
  }, []);

  // 🔼 tăng số lượng
  const increaseQty = (id) => {
    const user = getUser();

    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updated);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
  };

  // 🔽 giảm số lượng
  const decreaseQty = (id) => {
    const user = getUser();

    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCartItems(updated);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
  };

  // ❌ xóa sản phẩm
  const removeItem = (id) => {
    const user = getUser();

    const updated = cartItems.filter(item => item.id !== id);

    setCartItems(updated);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updated));
  };

  // 💰 tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🚀 thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    navigate("/checkout");
  };

  return (
  <div className="cart-container">
    <h1>🛒 Giỏ hàng của bạn</h1>

    {cartItems.length === 0 ? (
      <p>Chưa có sản phẩm</p>
    ) : (
      <div className="cart-grid">

        {/* 🔥 BÊN TRÁI - danh sách */}
        <div className="cart-left">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">

              <img
                src={`http://localhost:3000/uploads/${item.image}`}
                alt={item.name}
              />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>{Number(item.price).toLocaleString()} VND</p>

                <div className="qty">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

                <p>
                  Tổng: {(item.price * item.quantity).toLocaleString()} VND
                </p>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
              >
                Xóa
              </button>

            </div>
          ))}
        </div>

        {/* 🔥 BÊN PHẢI */}
        <div className="cart-right">

          {/* 💰 tổng tiền */}
          <div className="summary-box">
            <h2>Tổng đơn hàng</h2>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>

            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>
          </div>

          {/* 🚀 thanh toán */}
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán
          </button>

        </div>
      </div>
    )}
  </div>
);
}

export default Cart;