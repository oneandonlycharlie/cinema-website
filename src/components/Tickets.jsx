import { useEffect, useState } from "react";
import "../css/Tickets.css";

export default function Tickets() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/users/me/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        console.warn("User orders", result);
        if (res.ok) setOrders(result.data || []);
        else setError(result.message || "Failed to load tickets");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders.length) return <p>You have no tickets.</p>;

  return (
    <div className="my-tickets-container">
        <h2>My Tickets</h2>
        {orders.length === 0 && <p>You have no orders yet.</p>}
        {orders.map((order) => (
        <div key={order.orderId} className="ticket-card">
            <h3>Order #{order.orderId}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>

            <div className="tickets-list">
            <h4>Tickets:</h4>
            <ul>
                {order.tickets.map((ticket) => (
                <li key={ticket.ticketId}>
                    <p><strong>Film:</strong> {ticket.filmName}</p>
                    <p><strong>Hall:</strong> {ticket.hallName}</p>
                    <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                    <p><strong>Price:</strong> ${ticket.price}</p>
                    <p><strong>Showtime:</strong> {new Date(ticket.showtime).toLocaleString()}</p>
                </li>
                ))}
            </ul>
            </div>
        </div>
        ))}
    </div>
    );
}