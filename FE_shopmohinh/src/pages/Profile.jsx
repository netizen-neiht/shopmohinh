import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: ""
  });

  const API = "http://localhost:3000/api";

  // ===== LOAD USER =====
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/users/${user.id}`);
        const data = res.data;

        setForm({
          username: data.username || "",
          email: data.email || "",
          full_name: data.full_name || "",
          phone: data.phone || "",
          password: ""
        });

      } catch (err) {
        console.error("Lỗi load user:", err);
      }
    };

    if (user?.id) {
      fetchUser();
    }
  }, []);

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ===== VALIDATE =====
  const validateForm = () => {
    if (!form.username.trim()) {
      alert("Username không được để trống");
      return false;
    }

    if (!form.full_name.trim()) {
      alert("Họ tên không được để trống");
      return false;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("SĐT phải gồm 10 số và bắt đầu bằng số 0");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không đúng định dạng");
      return false;
    }

    return true;
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        username: form.username.trim(),
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        phone: form.phone
      };

      if (form.password && form.password.trim() !== "") {
        data.password = form.password;
      }

      await axios.put(`${API}/users/${user.id}`, data);

      alert("Cập nhật thành công");

      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);

    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>

      {!isEditing ? (
        <div className="profile-view">
          <p><b>Username:</b> {form.username}</p>
          <p><b>Email:</b> {form.email}</p>
          <p><b>Họ tên:</b> {form.full_name}</p>
          <p><b>SĐT:</b> {form.phone}</p>
          <p><b>Mật khẩu:</b> ••••••••</p>

          <button className="profile-btn" onClick={() => setIsEditing(true)}>
            Sửa
          </button>
        </div>
      ) : (
        <div className="profile-form">
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Họ tên</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              maxLength={10}
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm({ ...form, phone: value });
              }}
              required
            />
          </div>

          <div>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="password"
              placeholder="Để trống nếu không đổi"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="profile-btn" onClick={handleUpdate}>
              Lưu
            </button>

            <button
              className="profile-btn"
              style={{ background: "#999" }}
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;