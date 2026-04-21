import { Link } from "react-router-dom";
import "../assets/css/Header.css";

function Header() {
  return (
    <header className="header">

      {/* TOP */}
      <div className="top-bar">
        <div className="logo">
          <Link to="/">Neiht Hobby Store</Link>
        </div>

        <input
          className="search"
          type="text"
          placeholder="Tìm mô hình..."
        />

        <div className="actions">
          <Link to="/login">Đăng nhập</Link>
          <Link to="/cart">🛒 Giỏ hàng</Link>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav-bar">
        <ul className="menu">

          <li><Link to="/">Trang chủ</Link></li>

          <li className="dropdown">
            <Link to="/products">Sản phẩm</Link>

            <ul className="dropdown-menu">

              {/* BANDai */}
              <li className="has-submenu">
                <Link to="/products?type=Bandai">Bandai</Link>
                <ul className="submenu">
                  <li><Link to="/products?type=Bandai&grade=SD">SD</Link></li>
                  <li><Link to="/products?type=Bandai&grade=HG">HG</Link></li>
                  <li><Link to="/products?type=Bandai&grade=RG">RG</Link></li>
                  <li><Link to="/products?type=Bandai&grade=MG">MG</Link></li>
                  <li><Link to="/products?type=Bandai&grade=PG">PG</Link></li>
                </ul>
              </li>

              {/* FIGURE */}
              <li className="has-submenu">
                <Link to="/products?type=Figure">Figure</Link>
                <ul className="submenu">
                  <li><Link to="/products?type=Figure Nam">Figure Nam</Link></li>
                  <li><Link to="/products?type=Figure Nữ">Figure Nữ</Link></li>
                </ul>
              </li>

              {/* KOTOBUKIYA */}
              <li>
                <Link to="/products?type=Kotobukiya">Kotobukiya</Link>
              </li>

              <li>
                <Link to="/products?type=Model Kit Trung">Model Kit Trung </Link>
              </li>

            </ul>
          </li>

          <li><Link to="/wishlist">Yêu thích</Link></li>
          <li><Link to="/contact">Liên hệ</Link></li>

        </ul>
      </nav>

    </header>
  );
}

export default Header;