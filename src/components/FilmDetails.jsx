import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/FilmDetails.css";
import.meta.env.VITE_API_BASE_URL;

export default function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingShowtime, setBookingShowtime] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const res = await fetch(`/api/films/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) setFilm(result.data);
        else setError(result.message || "Failed to fetch film details");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id, token]);

  const handleBookingClick = (showtime) => {
    setBookingShowtime(showtime);
    setSeatsToBook(1);
  };

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showtimeId: bookingShowtime.id,
          seatCount: seatsToBook,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const order = result.data;
        navigate(`/orders/${order.id}`, { state: { order } });
      } else {
        alert(`Order failed: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while creating order");
    }
  };

  if (loading) return <p className="loading">Loading film details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!film) return <p className="error">Film not found</p>;

  return (
    <div className="details-container">
      <div className="film-header">
        <div className="film-cover">
          <img src={`${import.meta.env.VITE_API_BASE_URL}${film.coverImageUrl}`} alt={film.name} />
        </div>
        <div className="film-info">
          <h1 className="details-title">{film.name}</h1>
          <p className="details-description">{film.intro}</p>
          <p>Duration: {film.length} min</p>
          <p>Director: {film.director || "N/A"}</p>
          <p>Actors: {film.actors?.join(", ") || "N/A"}</p>
          <p>Genre: {film.genre}</p>
          <p>Rating: {film.rating}</p>
        </div>
      </div>

      <h2 className="sessions-title">Showtimes</h2>
      <ul className="sessions-list">
        {film.showTimes.length > 0 ? (
          film.showTimes.map((showtime) => (
            <li key={showtime.id} className="session-item">
              <span>
                {new Date(showtime.startTime).toLocaleString()} |{" "}
                {showtime.hallName} | ${showtime.price}
              </span>
              <button
                className="book-button"
                onClick={() => handleBookingClick(showtime)}
              >
                Book
              </button>
            </li>
          ))
        ) : (
          <li>No showtimes available</li>
        )}
      </ul>

      {/* Booking modal */}
      {bookingShowtime && (
        <div className="modal">
          <h3>Booking: {film.name}</h3>
          <p>Showtime: {new Date(bookingShowtime.startTime).toLocaleString()}</p>
          <p>Hall: {bookingShowtime.hallName}</p>
          <p>Price per seat: ${bookingShowtime.price}</p>

          <label>
            Number of seats:
            <input
              type="number"
              min="1"
              max={bookingShowtime.seatIds.length || 10}
              value={seatsToBook}
              onChange={(e) => setSeatsToBook(Number(e.target.value))}
            />
          </label>
          <div className="modal-buttons">
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
            <button onClick={() => setBookingShowtime(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
