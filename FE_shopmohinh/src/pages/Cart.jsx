import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(data);
  }, []);

  // tăng số lượng
  const increaseQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // giảm số lượng
  const decreaseQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // xóa sản phẩm
  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // tổng tiền
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // chuyển sang checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Giỏ hàng đang trống</p>
      ) : (
        <div className="cart-grid">
          {/* danh sách sản phẩm */}
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h2>{item.name}</h2>
                  <p className="price">
                    {item.price.toLocaleString()} VND
                  </p>

                  <div className="quantity">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* tổng tiền */}
          <div className="cart-summary">
            <h2>Tổng đơn hàng</h2>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>

            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>

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