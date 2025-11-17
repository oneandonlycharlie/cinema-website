import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const [films, setfilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchfilms = async () => {
      try {
        const res = await fetch("/api/films",{
          headers: { "Authorization": `Bearer ${token}` },
          method: "GET",
        });
        const result = await res.json();
        if (res.ok) {
          setfilms(result.data || []);
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

    fetchfilms();
  }, []);

  if (loading) return <p className="loading">Loading films...</p>;
  if (error) return <p className="error">{error}</p>;

  console.warn(films);

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
            <h2 className="film-title">{film.name}</h2>
            <p className="film-description">{film.intro}</p>
            <p className="film-duration">Duration: {film.length} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
