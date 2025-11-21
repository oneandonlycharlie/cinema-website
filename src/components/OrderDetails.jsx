import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/OrderDetails.css";

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const { order } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paid, setPaid] = useState(order?.status === "PAID");

  if (!order) {
    return <p className="error">No order data found.</p>;
  }

  const handlePay = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setPaid(true);
        setTimeout(() => {
          navigate("/tickets");
        }, 500);
      } else {
        setError(result.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error while paying");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <p>
        <strong>Order ID:</strong> {order.id}
      </p>
      <p>
        <strong>Film:</strong> {order.filmName}
      </p>
      <p>
        <strong>Showtime:</strong>{" "}
        {new Date(order.showtimeStart).toLocaleString()}
      </p>
      <p>
        <strong>Hall:</strong> {order.hallName}
      </p>
      <p>
        <strong>Seats:</strong> {order.seatCount}
      </p>
      <p>
        <strong>Total Amount:</strong> ${order.totalAmount}
      </p>

      {error && <p className="error">{error}</p>}

      {!paid && (
        <button onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      )}

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
