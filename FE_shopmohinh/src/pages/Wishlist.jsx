import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // load wishlist từ localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    setWishlist(data);
  }, []);

  // ❌ xóa khỏi wishlist
  const removeWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🛒 thêm vào giỏ hàng
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng 🛒");
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Wishlist của bạn ❤️</h1>

      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Chưa có sản phẩm trong wishlist
        </p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="wishlist-link"
            >
              <div className="wishlist-item">

                {/* ảnh */}
                <img
                  src={`http://localhost:3000/uploads/${item.image}`}
                  alt={item.name}
                  className="wishlist-img"
                />

                {/* tên */}
                <h3>{item.name}</h3>

                {/* giá */}
                <p className="wishlist-price">
                  {Number(item.price).toLocaleString()} VND
                </p>

                {/* loại */}
                <p>
                  {item.type_name}
                  {item.grade_name ? ` (${item.grade_name})` : ""}
                </p>

                {/* nút */}
                <div className="wishlist-actions">

                  <button
                    className="add-cart-btn"
                    onClick={(e) => {
                      e.preventDefault(); // ❗ chặn link
                      addToCart(item);
                    }}
                  >
                    🛒 Thêm vào giỏ
                  </button>

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.preventDefault(); // ❗ chặn link
                      removeWishlist(item.id);
                    }}
                  >
                    ❌ Xóa
                  </button>

                </div>

              </div>
            </Link>

          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;