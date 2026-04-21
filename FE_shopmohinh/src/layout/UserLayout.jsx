import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Outlet /> {/* Nơi hiển thị nội dung của các trang con */}
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;