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
  const type = params.get("type") || "";
  const grade = params.get("grade") || "";
  const sort = params.get("sort") || "";

  const getUser = () => JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let url = "http://localhost:3000/api/products";

    // ===== SEARCH =====
    if (keyword) {
      url = `http://localhost:3000/api/products/search?q=${keyword}`;
    }

    // ===== FILTER + SORT =====
    else {
      const query = [];

      if (type) query.push(`type=${type}`);
      if (grade) query.push(`grade=${grade}`);
      if (sort) query.push(`sort=${sort}`);

      if (query.length > 0) {
        url += `?${query.join("&")}`;
      }
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.log("API error:", err);
        setProducts([]);
      });

    const user = getUser();
    if (user) {
      const fav = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(fav);
    }
  }, [location.search]);

  // ===== REQUIRE LOGIN =====
  const requireLogin = () => {
    alert("Bạn cần đăng nhập!");
    navigate("/login");
  };

  // ===== FAVORITE =====
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

  // ===== ADD TO CART =====
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

  // ===== SORT HANDLER (GIỮ FILTER) =====
  const handleSort = (value) => {
    const query = new URLSearchParams(location.search);

    if (value) {
      query.set("sort", value);
    } else {
      query.delete("sort");
    }

    navigate(`/products?${query.toString()}`);
  };

  return (
    <div>

      {/* ===== SORT UI ===== */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => handleSort("asc")}>
          Giá tăng dần ⬆
        </button>

        <button onClick={() => handleSort("desc")}>
          Giá giảm dần ⬇
        </button>

        <button onClick={() => handleSort("")}>
          Mặc định
        </button>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="products-list">

        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => {
            const isFavorite = favorites.some(i => i.id === product.id);

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
          })
        ) : (
          <p style={{ textAlign: "center" }}>Không có sản phẩm</p>
        )}

      </div>
    </div>
  );
}

export default Products;