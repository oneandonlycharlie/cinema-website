// Films.jsx
import { useEffect, useState } from "react";
import FilmItem from "./FilmItem";
import "../css/Films.css";
import AddFilmForm from "./AddFilmForm";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const fetchFilms = async () => {
    try {
      const res = await fetch("/api/films", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      console.warn(result)
      if (res.ok) setFilms(result.data || []);
      else setError(result.message);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const addShowtime = async (filmId, form) => {
    const res = await fetch(`/api/films/${filmId}/showtimes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) fetchFilms();
  };

  const updateShowtime = async (id, data) => {
    await fetch(`/api/showtimes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    fetchFilms();
  };

  const deleteShowtime = async (id) => {
    await fetch(`/api/showtimes/${id}`, { method: "DELETE", Authorization: `Bearer ${token}` });
    fetchFilms();
  };

  const addFilm = async (film) => {
  const res = await fetch("/api/films", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });
  if (res.ok) {
    fetchFilms();
  }
};

  const updateFilm = async (id) => {
    await fetch(`/api/films/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingFilm),
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
      <AddFilmForm onAdd={addFilm} />
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
          />
        ))}
      </ul>
    </div>
  );
}
