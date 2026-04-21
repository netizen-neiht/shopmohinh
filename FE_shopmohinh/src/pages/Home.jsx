import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Products.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);

        const featuredProducts = [...data]
          .sort((a, b) => b.product_view - a.product_view)
          .slice(0, 8);

        const latestProducts = [...data]
          .sort((a, b) => b.id - a.id)
          .slice(0, 8);

        setFeatured(featuredProducts);
        setLatest(latestProducts);
      });

    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  const toggleFavorite = (product, e) => {
    e.preventDefault();

    let fav = [...favorites];
    const exists = fav.find(item => item.id === product.id);

    if (exists) {
      fav = fav.filter(item => item.id !== product.id);
    } else {
      fav.push(product);
    }

    setFavorites(fav);
    localStorage.setItem("favorites", JSON.stringify(fav));
  };

  const addToCart = (product, e) => {
    e.preventDefault();

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

  const renderProducts = (list) => {
    return list.map(product => {
      const isFavorite = favorites.some(
        item => item.id === product.id
      );

      return (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="product-link"
        >
          <div className="product-item">

            <div
              className="favorite-icon"
              onClick={(e) => toggleFavorite(product, e)}
            >
              {isFavorite ? "❤️" : "🤍"}
            </div>

            <img
              src={`http://localhost:3000/uploads/${product.image}`}
              alt={product.name}
              className="product-img"
            />

            <h3>{product.name}</h3>

            <p>{Number(product.price).toLocaleString()} VND</p>

            <button
              className="add-cart-btn"
              onClick={(e) => addToCart(product, e)}
            >
              🛒 Thêm vào giỏ
            </button>

          </div>
        </Link>
      );
    });
  };

  return (
    <div>
      <h2>⭐ Sản phẩm nổi bật</h2>
      <div className="products-list">{renderProducts(featured)}</div>

      <h2>🆕 Sản phẩm mới nhất</h2>
      <div className="products-list">{renderProducts(latest)}</div>
    </div>
  );
}

export default Home;