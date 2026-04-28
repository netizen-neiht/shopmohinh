import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }

    const data = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
    setWishlist(data);
  }, []);

  return (
    <div>
      {wishlist.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export default Wishlist;