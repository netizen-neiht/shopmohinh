import { Link } from "react-router-dom";
import "../assets/css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      
      <div className="footer-container">

        {/* CỘT 1 */}
        <div className="footer-col">
          <h3>Shop Mô Hình</h3>
          <p>Chuyên cung cấp mô hình Figure, Gundam chính hãng, giá tốt.</p>
        </div>

        {/* CỘT 2 */}
        <div className="footer-col">
          <h4>Danh mục</h4>
          <ul>
            <li><Link to="/products?type=Figure">Figure</Link></li>
            <li><Link to="/products?type=Bandai">Gundam</Link></li>
            <li><Link to="/products?type=Kotobukiya">Kotobukiya</Link></li>
            <li><Link to="/products?type=Model+Kit+Trung">Model Kit Trung</Link></li>
          </ul>
        </div>

        {/* CỘT 3 */}
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li>Liên hệ</li>
            <li>Chính sách</li>
            <li>Hướng dẫn mua hàng</li>
          </ul>
        </div>

        {/* CỘT 4 */}
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <p>Email: shopmohinh@gmail.com</p>
          <p>Phone: 0123 456 789</p>
        </div>

      </div>

      
      <div className="footer-bottom">
        <p>© 2026 Shop Mô Hình. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;