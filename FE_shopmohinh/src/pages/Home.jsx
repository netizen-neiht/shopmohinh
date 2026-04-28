import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Products.css";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]); // 🔥 thêm
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();
  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {

        // ⭐ nổi bật (view)
        const featuredProducts = [...data]
          .sort((a, b) => b.product_view - a.product_view)
          .slice(0, 8);

        // 🆕 mới nhất (id mới nhất)
        const latestProducts = [...data]
          .sort((a, b) => b.id - a.id)
          .slice(0, 8);

        setFeatured(featuredProducts);
        setLatest(latestProducts);
      });

    const user = getUser();
    if (user) {
      const fav = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(fav);
    }
  }, []);

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

    if (exists) fav = fav.filter(i => i.id !== product.id);
    else fav.push(product);

    setFavorites(fav);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(fav));
  };

  const addToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const user = getUser();
    if (!user) return requireLogin();

    let cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

    const index = cart.findIndex(i => i.id === product.id);
    if (index !== -1) cart[index].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
  };

  // 🔥 render reusable
  const renderProducts = (list) =>
    list.map(product => {
      const isFavorite = favorites.some(i => i.id === product.id);

      return (
        <Link key={product.id} to={`/product/${product.id}`} className="product-link">
          <div className="product-item">

            <div onClick={(e) => toggleFavorite(product, e)}>
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
    });

  return (
    <div>
      {/* ⭐ nổi bật */}
      <h1>⭐ Sản phẩm nổi bật</h1>
      <div className="products-list">
        {renderProducts(featured)}
      </div>

      {/* 🆕 mới nhất */}
      <h1>🆕 Sản phẩm mới nhất</h1>
      <div className="products-list">
        {renderProducts(latest)}
      </div>
    </div>
  );
}

export default Home;