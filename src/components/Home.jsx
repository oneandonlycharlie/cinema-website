import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch("/api/films", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) {
          setFilms(result.data || []);
        } else {
          setError(result.message || "Failed to fetch films");
        }
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [token]);

  if (loading) return <p className="loading">Loading films...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      <h1 className="home-title">Now Showing</h1>
      <div className="films-grid">
        {films.map((film) => (
          <div
            key={film.id}
            className="film-card"
            onClick={() => navigate(`/films/${film.id}`)}
          >
            <div className="film-cover">
              <img src={`${import.meta.env.VITE_API_BASE_URL}${film.coverImageUrl}`} alt={film.name} />
            </div>
            <h2 className="film-title">{film.name}</h2>
            <p className="film-description">{film.intro}</p>
            <p className="film-duration">Duration: {film.length} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
