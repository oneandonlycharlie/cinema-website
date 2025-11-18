import { useEffect, useState } from "react";

export default function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    if (res.ok) setOrders(result.data);
  };

  const deleteOrder = async (id) => {
    await fetch(`/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders();
  };

  return (
    <div className="admin-container">
      <h1>🧾 Order Management</h1>

      <ul>
        {orders && orders.map(o => (
          <li key={o.id}>
            Order #{o.id} — film {o.filmName} — seat {o.seat} — time {o.time}
            <button onClick={() => deleteOrder(o.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
