import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/AdminDashboard.css";

const API = "http://localhost:3000/api/products";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    images: [],
    type_id: "",
    grade_id: ""
  });

  const [fileKey, setFileKey] = useState(Date.now()); // 🔥 reset input

  if (!user || user.role !== "admin") {
    return <h2>Không có quyền truy cập</h2>;
  }

  // ================= FETCH =================
  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } 
    else if (e.target.name === "images") {
      setForm({ ...form, images: Array.from(e.target.files) }); // 🔥 FIX
    } 
    else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("type_id", form.type_id);
    data.append("grade_id", form.grade_id);

    // ảnh chính
    if (form.image) {
      data.append("image", form.image);
    }

    // 🔥 ảnh phụ
    if (form.images.length > 0) {
      form.images.forEach((img) => {
        data.append("images", img);
      });
    }

    // DEBUG
    console.log("MAIN:", form.image);
    console.log("SUB:", form.images);

    try {
      if (editing) {
        await axios.post(`${API}/update/${editing}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Cập nhật thành công");
      } else {
        await axios.post(`${API}/create`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Thêm sản phẩm thành công");
      }

      // RESET FORM
      setForm({
        name: "",
        price: "",
        description: "",
        image: null,
        images: [],
        type_id: "",
        grade_id: ""
      });

      setEditing(null);
      setFileKey(Date.now()); // 🔥 reset input file
      fetchProducts();

    } catch (err) {
      console.log(err);
      alert("Lỗi upload");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xoá sản phẩm?")) return;

    await axios.delete(`${API}/delete/${id}`);
    fetchProducts();
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      image: null,
      images: [],
      type_id: p.type_id || "",
      grade_id: p.grade_id || ""
    });

    setFileKey(Date.now()); // reset input
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>ADMIN DASHBOARD</h1>

        <div>
          <button onClick={() => navigate("/admin/orders")}>
            Quản lý đơn hàng
          </button>

          <button onClick={() => navigate("/admin/users")}>
            Quản lý người dùng
          </button>

          <button onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />

        <select name="type_id" value={form.type_id} onChange={handleChange}>
          <option value="">Loại</option>
          <option value="1">Figure Nam</option>
          <option value="2">Figure Nữ</option>
          <option value="3">Bandai</option>
          <option value="4">Kotobukiya</option>
          <option value="5">Model Kit Trung</option>
        </select>

        <select name="grade_id" value={form.grade_id} onChange={handleChange}>
          <option value="">Grade</option>
          <option value="1">SD</option>
          <option value="2">HG</option>
          <option value="3">RG</option>
          <option value="4">MG</option>
          <option value="5">PG</option>
        </select>

        {/* ẢNH CHÍNH */}
        <input
          key={fileKey}
          type="file"
          name="image"
          onChange={handleChange}
        />

        {/* ẢNH PHỤ */}
        <input
          key={fileKey + 1}
          type="file"
          name="images"
          multiple
          onChange={handleChange}
        />

        <button type="submit">
          {editing ? "Cập nhật" : "Thêm"}
        </button>
      </form>

      {/* LIST */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id}>
            <img
              src={`http://localhost:3000/uploads/${p.image}`}
              alt={p.name}
            />

            <h3>{p.name}</h3>
            <p>{Number(p.price).toLocaleString()} VND</p>

            <button onClick={() => handleEdit(p)}>Sửa</button>
            <button onClick={() => handleDelete(p.id)}>Xoá</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;