import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Users.css";

const API = "http://localhost:3000/api/users";

function Users() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Xóa user này?")) {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    }
  };

  const startEdit = (user) => {
    setEditing({
      ...user,
      password: "" // 👈 thêm password
    });
  };

  const handleUpdate = async () => {
    await axios.put(`${API}/${editing.id}`, {
      full_name: editing.full_name,
      phone: editing.phone,
      password: editing.password // 👈 gửi password
    });

    setEditing(null);
    fetchUsers();
  };

  return (
    <div className="users-page">

      {/* HEADER */}
      <div className="users-header">
        <h1>Quản lý khách hàng</h1>
        <button onClick={() => navigate("/admin/Dashboard")}>
           Dashboard
        </button>
        <button onClick={() => navigate("/admin/orders")}>
            Quản lý đơn hàng
          </button>
          
      </div>

      {/* TABLE */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Mật khẩu</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">Không có dữ liệu</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                {/* NAME */}
                <td>
                  {editing?.id === u.id ? (
                    <input
                      value={editing.full_name}
                      onChange={(e) =>
                        setEditing({ ...editing, full_name: e.target.value })
                      }
                    />
                  ) : (
                    u.full_name
                  )}
                </td>

                {/* EMAIL */}
                <td>{u.email}</td>

                {/* PHONE */}
                <td>
                  {editing?.id === u.id ? (
                    <input
                      value={editing.phone}
                      onChange={(e) =>
                        setEditing({ ...editing, phone: e.target.value })
                      }
                    />
                  ) : (
                    u.phone
                  )}
                </td>

                {/* PASSWORD */}
                <td>
                  {editing?.id === u.id ? (
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={editing.password}
                      onChange={(e) =>
                        setEditing({ ...editing, password: e.target.value })
                      }
                    />
                  ) : (
                    "******"
                  )}
                </td>

                {/* ACTION */}
                <td>
                  {editing?.id === u.id ? (
                    <>
                      <button className="btn-save" onClick={handleUpdate}>
                        Lưu
                      </button>
                      <button className="btn-cancel" onClick={() => setEditing(null)}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => startEdit(u)}>
                        Sửa
                      </button>
                      <button className="btn-delete" onClick={() => deleteUser(u.id)}>
                        Xóa
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Users;