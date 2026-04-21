import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../assets/css/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const grade = params.get("grade");

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => setProducts(data));

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
  };

  const filteredProducts = products.filter(p => {
  let match = true;

  if (type) {
    if (type === "Figure") {
      match = p.type_name?.toLowerCase().includes("figure");
    } else {
      match = p.type_name === type;
    }
  }

  if (grade) {
    match = match && p.grade_name === grade;
  }

  return match;
});

  return (
    <div className="products-list">
      {filteredProducts.map(product => {
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
              />

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