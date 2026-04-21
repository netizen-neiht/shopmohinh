// src/pages/Login.jsx
import { useState } from "react";
import "../assets/css/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng nhập thành công");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi server");
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Đăng nhập</button>
         <p>Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
      </form>

       
    </div>
  );
}

export default Login;