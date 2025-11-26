import { useEffect, useState } from "react";
import FilmItem from "./FilmItem";
import "../css/Films.css";
import AddFilmForm from "./AddFilmForm";


export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [halls, setHalls] = useState([]);

  const [newFilm, setNewFilm] = useState({
    name: "",
    intro: "",
    length: 0,
    genre: "",
    rating: 0,
  });

  const [editingFilm, setEditingFilm] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchFilms();
    fetchHalls();
  }, []);

  const fetchFilms = async () => {
    try {
      const res = await fetch("/api/films", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setFilms(result.data || []);
      else setError(result.message);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    const res = await fetch("/api/halls", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setHalls(data.data || []);
  };

  const addShowtime = async (filmId, form) => {
    const res = await fetch(`/api/films/${filmId}/showtimes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.status === 409) {
      alert("This showtime conflicts with an existing showtime in the same hall. Please choose a different time or hall.");
    }
    if (res.ok) fetchFilms();
  };

  const updateShowtime = async (filmId, id, data) => {
    const res = await fetch(`/api/films/${filmId}/showtimes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (res.status === 409) {
      alert("This showtime conflicts with an existing showtime in the same hall. Please choose a different time or hall.");
    }
    fetchFilms();
  };

  const deleteShowtime = async (filmId, id) => {
    await fetch(`/api/films/${filmId}/showtimes/${id}`, { method: "DELETE", headers:{Authorization: `Bearer ${token}` }});
    fetchFilms();
  };

  const addFilm = async (formData) => {
    const res = await fetch("/api/films", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    if (res.ok) {
      fetchFilms();
    }
  };

  const updateFilm = async (id, formData) => {
    await fetch(`/api/films/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    setEditingFilm(null);
    fetchFilms();
  };

  const deleteFilm = async (id) => {
    await fetch(`/api/films/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFilms();
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-container">
      <h1>Film Management</h1>
      <ul className="films-list">
        {films.map((film) => (
          <FilmItem
            key={film.id}
            film={film}
            editingFilm={editingFilm}
            setEditingFilm={setEditingFilm}
            onSaveFilm={updateFilm}
            onDeleteFilm={deleteFilm}
            onAddShowtime={addShowtime}
            onUpdateShowtime={updateShowtime}
            onDeleteShowtime={deleteShowtime}
            halls = {halls}
          />
        ))}
      </ul>
      <AddFilmForm onAdd={addFilm} />
    </div>
  );
}
