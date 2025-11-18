import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/FilmDetails.css";

export default function filmDetails() {
  const { id } = useParams();
  const [film, setfilm] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");


  useEffect(() => {
    const fetchfilm = async () => {
      try {
        const res = await fetch(`/api/films/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
          method: "GET",
        });
        const result = await res.json();

        if (res.ok) {
          setfilm(result.data);
          setSessions([]);
        } else {
          setError(result.message || "Failed to fetch film details");
        }
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchfilm();
  }, [id]);

  const handleBooking = (sessionId) => {
    // 跳转到订票页，或者打开 modal
    console.log("Booking session", sessionId);
    alert(`Booking session ${sessionId}...`);
  };

  if (loading) return <p className="loading">Loading film details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!film) return <p className="error">film not found</p>;

  return (
    <div className="details-container">
      <h1 className="details-title">{film.name}</h1>
      <p className="details-description">{film.intro}</p>
      <p className="details-duration">Duration: {film.length} min</p>

      <h2 className="sessions-title">Sessions</h2>
      <ul className="sessions-list">
        {sessions.map((session) => (
          <li key={session.id} className="session-item">
            <span>
              {new Date(session.startTime).toLocaleString()} | Hall: {session.hall}
            </span>
            <button
              className="book-button"
              onClick={() => handleBooking(session.id)}
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
