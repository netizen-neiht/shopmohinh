import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 slider state
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
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

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  // 🔥 gộp ảnh chính + ảnh phụ
  const allImages = [
    product.image,
    ...(product.images || [])
  ];

  // 🔥 next / prev
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="product-detail">

      <Link to="/" className="back-link">
        ← Quay lại
      </Link>

      <div className="detail-container">

        {/* LEFT */}
        <div className="detail-left">

          <div className="image-slider">

            <button className="arrow left" onClick={prevImage}>
              ❮
            </button>

            <img
              src={`http://localhost:3000/uploads/${allImages[currentIndex]}`}
              alt="product"
              className="main-image"
            />

            <button className="arrow right" onClick={nextImage}>
              ❯
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="detail-right">
          <h1>{product.name}</h1>

          <p className="price">
            {Number(product.price).toLocaleString()} VND
          </p>

          <p><strong>Loại:</strong> {product.type_name}</p>
          <p><strong>Grade:</strong> {product.grade_name || "Không có"}</p>

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