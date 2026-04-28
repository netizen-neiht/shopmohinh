import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // 🔥 chặn user thường
  if (!user || user.role !== "admin") {
    return <h2>Không có quyền truy cập</h2>;
  }

  // 🔥 logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // cập nhật header
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ADMIN DASHBOARD</h1>

      {/* 🔥 thông tin admin */}
      <div style={{ marginTop: "20px" }}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* 🔥 nút logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default Dashboard;