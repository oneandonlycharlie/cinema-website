import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/FilmDetails.css";

export default function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingShowtime, setBookingShowtime] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const token = localStorage.getItem("jwtToken");

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
  }, [id]);

  const handleBookingClick = (showtime) => {
    setBookingShowtime(showtime);
    setSeatsToBook(1); // 默认 1 个座位
  };

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(`/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showtimeId: bookingShowtime.id,
          seats: seatsToBook,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Booking successful! ${seatsToBook} seat(s) reserved.`);
        setBookingShowtime(null);
      } else {
        alert(`Booking failed: ${result.message}`);
      }
    } catch {
      alert("Network error while booking");
    }
  };

  if (loading) return <p className="loading">Loading film details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!film) return <p className="error">Film not found</p>;

  return (
    <div className="details-container">
      <h1>{film.name}</h1>
      <p>{film.intro}</p>
      <p>Duration: {film.length} min</p>
      <p>Director: {film.director || "N/A"}</p>
      <p>Actors: {film.actors?.join(", ") || "N/A"}</p>
      <p>Genre: {film.genre}</p>
      <p>Rating: {film.rating}</p>

      <h2>Showtimes</h2>
      <ul>
        {film.showTimes.length > 0 ? (
          film.showTimes.map((showtime) => (
            <li key={showtime.id}>
              {new Date(showtime.startTime).toLocaleString()} | {showtime.hallName} | ${showtime.price}
              <button onClick={() => handleBookingClick(showtime)}>Book</button>
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
              max={bookingShowtime.seatIds.length || 10} // 可选：设置最大可选座位
              value={seatsToBook}
              onChange={(e) => setSeatsToBook(Number(e.target.value))}
            />
          </label>
          <button onClick={handleConfirmBooking}>Confirm Booking</button>
          <button onClick={() => setBookingShowtime(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
