import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Orders.css";

const API = "http://localhost:3000/api/orders";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const res = await axios.get(`${API}/admin`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div className="orders-page">

      <div className="orders-header">
        <h1>Quản lý đơn hàng</h1>
        <div className="admin-actions"> <button onClick={() => navigate("/admin/Dashboard")}>
           Dashboard
        </button>
        <button onClick={() => navigate("/admin/users")}>
            Quản lý người dùng
          </button></div>
       
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Tổng tiền</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.full_name}</td>
              <td>{o.phone}</td>
              <td>{o.total_price} VND</td>
              <td>{new Date(o.order_date).toLocaleString()}</td>

              <td>
                <span className={`status ${o.status}`}>
                  {o.status}
                </span>
              </td>

              <td>
                <select
                  value={o.status}
                  onChange={(e) =>
                    updateStatus(o.id, e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  {/* <option value="shipping">shipping</option> */}
                  <option value="done">done</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Orders;