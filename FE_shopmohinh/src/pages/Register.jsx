import { useState } from "react";
import "../assets/css/Auth.css";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // validate
  const validate = () => {
    let newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Không được để trống";
    }

    if (!form.email.trim()) {
      newErrors.email = "Không được để trống";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      newErrors.email = "Email phải đúng dạng abc@gmail.com";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Không được để trống";
    } else if (!/^0\d{9}$/.test(form.phone)) {
      newErrors.phone = "SĐT phải bắt đầu bằng 0 và có 10 số";
    }

    if (!form.username.trim()) {
      newErrors.username = "Không được để trống";
    }

    if (!form.password.trim()) {
      newErrors.password = "Không được để trống";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công");
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
      <h2>Đăng ký</h2>

      <form onSubmit={handleRegister}>
        {/* Họ tên */}
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={form.fullName}
          onChange={handleChange}
          className={errors.fullName ? "input-error" : ""}
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        {/* Email */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* SĐT */}
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          className={errors.phone ? "input-error" : ""}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;