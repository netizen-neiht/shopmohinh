import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          setProduct(null);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi fetch:", err);
        setLoading(false);
      });
  }, [id]);

  // 🛒 thêm vào giỏ
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

  // loading
  if (loading) return <p>Đang tải...</p>;

  // không tìm thấy
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="product-detail">

      {/* quay lại */}
      <Link to="/" className="back-link">
        ← Quay lại
      </Link>

      {/* layout */}
      <div className="detail-container">

        {/* ảnh bên trái */}
        <div className="detail-left">
          <img
            src={`http://localhost:3000/uploads/${product.image}`}
            alt={product.name}
          />
        </div>

        {/* thông tin bên phải */}
        <div className="detail-right">
          <h1>{product.name}</h1>

          <p className="price">
            {Number(product.price).toLocaleString()} VND
          </p>

          <p><strong>Loại:</strong> {product.type_name}</p>

          <p>
            <strong>Grade:</strong>{" "}
            {product.grade_name || "Không có"}
          </p>

          <p>
            <strong>Mô tả:</strong>{" "}
            {product.description || "Chưa có mô tả"}
          </p>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(product)}
          >
            🛒 Thêm vào giỏ
          </button>
        </div>

      </div>

    </div>
  );
}

export default ProductDetail;