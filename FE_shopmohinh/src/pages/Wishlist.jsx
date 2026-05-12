import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Products.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();
  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = getUser();

    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }

    const fav = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
    setWishlist(fav);
    setFavorites(fav);
  }, []);

  const requireLogin = () => {
    alert("Bạn cần đăng nhập!");
    navigate("/login");
  };

  // ❤️ toggle favorite
  const toggleFavorite = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const user = getUser();
    if (!user) return requireLogin();

    let fav = [...favorites];
    const exists = fav.find(i => i.id === product.id);

    if (exists) {
      fav = fav.filter(i => i.id !== product.id);
    } else {
      fav.push(product);
    }

    setFavorites(fav);
    setWishlist(fav);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(fav));
  };

  // 🛒 add to cart
  const addToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const user = getUser();
    if (!user) return requireLogin();

    if (user.role === "admin") {
      alert("Admin không thể mua!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

    const index = cart.findIndex(i => i.id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    alert("Đã thêm vào giỏ!");
  };

  return (
    <div className="products-list">

      {wishlist.length > 0 ? (
        wishlist.map(product => {
          const isFavorite = favorites.some(i => i.id === product.id);

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-link"
            >
              <div className="product-item">

                {/* ❤️ icon */}
                <div
                  className="favorite-icon"
                  onClick={(e) => toggleFavorite(product, e)}
                >
                  {isFavorite ? "❤️" : "🤍"}
                </div>

                {/* 🖼 ảnh */}
                <img
                  src={`http://localhost:3000/uploads/${product.image}`}
                  alt={product.name}
                />

                {/* 📦 info */}
                <h3>{product.name}</h3>
                <p>{Number(product.price).toLocaleString()} VND</p>

                {/* 🛒 button */}
                <button onClick={(e) => addToCart(product, e)}>
                  🛒 Thêm vào giỏ
                </button>

              </div>
            </Link>
          );
        })
      ) : (
        <p style={{ textAlign: "center" }}>
          Chưa có sản phẩm yêu thích
        </p>
      )}

    </div>
  );
}

export default Wishlist;