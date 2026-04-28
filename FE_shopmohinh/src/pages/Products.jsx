import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../assets/css/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const keyword = params.get("q") || "";

  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let url = "http://localhost:3000/products";
    if (keyword) {
      url = `http://localhost:3000/products/search?q=${keyword}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data));

    const user = getUser();
    if (user) {
      const fav = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(fav);
    }
  }, [keyword]);

  const requireLogin = () => {
    alert("Bạn cần đăng nhập!");
    navigate("/login");
  };

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
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(fav));
  };

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
      {products.map(product => {
        const isFavorite = favorites.some(i => i.id === product.id);

        return (
          <Link key={product.id} to={`/product/${product.id}`} className="product-link">
            <div className="product-item">

              <div className="favorite-icon" onClick={(e) => toggleFavorite(product, e)}>
                {isFavorite ? "❤️" : "🤍"}
              </div>

              <img src={`http://localhost:3000/uploads/${product.image}`} />

              <h3>{product.name}</h3>
              <p>{Number(product.price).toLocaleString()} VND</p>

              <button onClick={(e) => addToCart(product, e)}>
                🛒 Thêm vào giỏ
              </button>

            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Products;