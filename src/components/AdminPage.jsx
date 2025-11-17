import { useDebugValue, useEffect, useState } from "react";
import "../css/AdminPage.css";

export default function AdminPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newFilm, setNewFilm] = useState({ name: "", intro: "", length: 0, genre: "" , rating: 0});
  const [editingFilm, setEditingFilm] = useState(null);
  const [newshowtime, setNewshowtime] = useState({ startTime: "", hall: "" });
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const res = await fetch("/api/films",{
        headers: { "Authorization": `Bearer ${token}` },
        method: "GET",
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

  const handleAddFilm = async () => {
    try {
      const res = await fetch("/api/films", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newFilm),
      });
      const result = await res.json();
      if (res.ok) {
        fetchFilms();
        setNewFilm({ name: "", intro: "", length: 0 , genre: "" , rating: 0});
      } else {
        alert(result.message || "Failed to add film");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateFilm = async (filmId) => {
    try {
      const res = await fetch(`/api/films/${filmId}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editingFilm),
      });
      const result = await res.json();
      if (res.ok) {
        fetchFilms();
        setEditingFilm(null);
      } else {
        alert(result.message || "Failed to update film");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFilm = async (filmId) => {
    // if (!window.confirm("Delete this film?")) return;
    try {
      const res = await fetch(`/api/films/${filmId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) fetchFilms();
      else console.log("Failed to delete film");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddshowtime = async (filmId) => {
    try {
      const res = await fetch(`/api/films/${filmId}/showtimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newshowtime),
      });
      const result = await res.json();
      if (res.ok) {
        fetchFilms();
        setNewshowtime({ startTime: "", hall: "" });
      } else {
        alert(result.message || "Failed to add showtime");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateshowtime = async (showtimeId, updatedshowtime) => {
    try {
      const res = await fetch(`/api/showtimes/${showtimeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedshowtime),
      });
      if (res.ok) fetchFilms();
      else alert("Failed to update showtime");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteshowtime = async (showtimeId) => {
    if (!window.confirm("Delete this showtime?")) return;
    try {
      const res = await fetch(`/api/admin/showtimes/${showtimeId}`, { method: "DELETE" });
      if (res.ok) fetchFilms();
      else alert("Failed to delete showtime");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-container">
      <h1>Film Management</h1>

      {/* 新增电影 */}
      <div className="film-form">
        <input
          type="text"
          placeholder="Title"
          value={newFilm.name}
          onChange={(e) => setNewFilm({ ...newFilm, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newFilm.intro}
          onChange={(e) => setNewFilm({ ...newFilm, intro: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration"
          value={newFilm.length}
          onChange={(e) => setNewFilm({ ...newFilm, length: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newFilm.genre}
          onChange={(e) => setNewFilm({ ...newFilm, genre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rating"
          value={newFilm.rating}
          onChange={(e) => setNewFilm({ ...newFilm, rating: parseInt(e.target.value) })}
        />
        <button onClick={handleAddFilm}>Add Film</button>
      </div>

      {/* 电影列表 */}
      <ul className="films-list">
        {films.map((film) => (
          <li key={film.id} className="film-item">
            {editingFilm?.id === film.id ? (
              <>
                <input
                  type="text"
                  value={editingFilm.name}
                  onChange={(e) => setEditingFilm({ ...editingFilm, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingFilm.intro}
                  onChange={(e) =>
                    setEditingFilm({ ...editingFilm, intro: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editingFilm.length}
                  onChange={(e) =>
                    setEditingFilm({ ...editingFilm, length: parseInt(e.target.value) })
                  }
                />
                <button onClick={() => handleUpdateFilm(film.id)}>Save</button>
                <button onClick={() => setEditingFilm(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{film.name}</h2>
                <p>{film.intro}</p>
                <p>Duration: {film.length} min</p>
                <button onClick={() => setEditingFilm(film)}>Edit</button>
                <button onClick={() => handleDeleteFilm(film.id)}>Delete</button>
              </>
            )}

            {/* 场次列表 */}
            <div className="showtimes-section">
              <h3>showtimes</h3>
              <ul>
                {film.showtimes?.map((showtime) => (
                  <li key={showtime.id}>
                    <input
                      type="datetime-local"
                      value={showtime.startTime?.slice(0, 16)}
                      onChange={(e) =>
                        handleUpdateshowtime(showtime.id, { ...showtime, startTime: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={showtime.hall}
                      onChange={(e) =>
                        handleUpdateshowtime(showtime.id, { ...showtime, hall: e.target.value })
                      }
                    />
                    <button onClick={() => handleDeleteshowtime(showtime.id)}>Delete</button>
                  </li>
                ))}
              </ul>

              {/* 新增场次 */}
              <div className="showtime-form">
                <input
                  type="datetime-local"
                  placeholder="Start Time"
                  value={newshowtime.startTime}
                  onChange={(e) => setNewshowtime({ ...newshowtime, startTime: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Hall"
                  value={newshowtime.hall}
                  onChange={(e) => setNewshowtime({ ...newshowtime, hall: e.target.value })}
                />
                <button onClick={() => handleAddshowtime(film.id)}>Add showtime</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
