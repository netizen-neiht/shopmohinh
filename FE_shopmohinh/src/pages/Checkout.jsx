import { useState } from "react";
import "../assets/css/Checkout.css";

function Checkout() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "cod",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // validate từng field
  const validate = () => {
    let newErrors = {};

    // name
    if (!form.name.trim()) {
      newErrors.name = "Không được để trống";
    }

    // phone
    if (!form.phone.trim()) {
      newErrors.phone = "Không được để trống";
    } else if (!/^0\d{9}$/.test(form.phone)) {
      newErrors.phone = "SĐT phải bắt đầu bằng 0 và có 10 chữ số";
    }

    // email
    if (!form.email.trim()) {
      newErrors.email = "Không được để trống";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      newErrors.email = "Email phải đúng định dạng (abc@gmail.com)";
    }

    // address
    if (!form.address.trim()) {
      newErrors.address = "Không được để trống";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    alert("Đặt hàng thành công!");
    console.log(form);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Thông tin nhận hàng</h2>

      <form onSubmit={handleSubmit} className="checkout-form">
        {/* name */}
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        {/* phone */}
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* email */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* address */}
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ nhận hàng"
          value={form.address}
          onChange={handleChange}
        />
        {errors.address && <p className="error">{errors.address}</p>}

        {/* payment */}
        
        <p >Phương thức thanh toán</p>

        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={form.payment === "cod"}
              onChange={handleChange}
            />
            COD
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={form.payment === "momo"}
              onChange={handleChange}
            />
            MoMo
          </label>
        </div>

        <button type="submit" className="checkout-btn">
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}

export default Checkout;