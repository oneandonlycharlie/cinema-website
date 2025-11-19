import { useState, useEffect } from "react";
import AddShowtimeForm from "./AddShowTimeForm";

export default function FilmItem({
  film,
  editingFilm,
  setEditingFilm,
  onSaveFilm,
  onDeleteFilm,
  onAddShowtime,
  onUpdateShowtime,
  onDeleteShowtime,
  halls
}) {
  const [localShowtimes, setLocalShowtimes] = useState([]);
  const [editingShowtimeId, setEditingShowtimeId] = useState(null);

  useEffect(() => {
    if (film.showTimes) {
      setLocalShowtimes(film.showTimes);
    }
  }, [film.showTimes]);

  const handleShowtimeChangeLocally = (showtimeId, field, value) => {
    setLocalShowtimes(prev =>
      prev.map(st => st.id === showtimeId ? { ...st, [field]: value } : st)
    );
  };

  const saveShowtime = (showtimeId) => {
    const st = localShowtimes.find(s => s.id === showtimeId);
    const body = {
      startTime: st.startTime,
      hallId: st.hallId,
      price: st.price
    };
    onUpdateShowtime(film.id, showtimeId, body);
    setEditingShowtimeId(null);
  };

  return (
    <li className="film-item">
      {/* 编辑电影信息 */}
      {editingFilm?.id === film.id ? (
        <>
          <input
            type="text"
            value={editingFilm.name}
            onChange={(e) =>
              setEditingFilm({ ...editingFilm, name: e.target.value })
            }
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
              setEditingFilm({
                ...editingFilm,
                length: parseInt(e.target.value),
              })
            }
          />
          <button onClick={() => onSaveFilm(film.id)}>Save</button>
          <button onClick={() => setEditingFilm(null)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{film.name}</h2>
          <p>{film.intro}</p>
          <p>Duration: {film.length} min</p>
          <button onClick={() => setEditingFilm(film)}>Edit</button>
          <button onClick={() => onDeleteFilm(film.id)}>Delete</button>
        </>
      )}

      {/* Showtime 列表 */}
      <div className="showtimes-section">
        <h3>Showtimes</h3>
        <ul>
          {localShowtimes.map((showtime) => (
            <li key={showtime.id}>
              {editingShowtimeId === showtime.id ? (
                <>
                  <input
                    type="datetime-local"
                    value={showtime.startTime?.slice(0, 16)}
                    onChange={(e) =>
                      handleShowtimeChangeLocally(showtime.id, "startTime", e.target.value)
                    }
                  />
                  <select
                    value={showtime.hallId || ""}
                    onChange={(e) =>
                      handleShowtimeChangeLocally(showtime.id, "hallId", parseInt(e.target.value))
                    }
                  >
                    <option value="">Select Hall</option>
                    {halls.map((hall) => (
                      <option key={hall.id} value={hall.id}>
                        {hall.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={showtime.price}
                    onChange={(e) =>
                      handleShowtimeChangeLocally(showtime.id, "price", Number(e.target.value))
                    }
                  />
                  <button onClick={() => saveShowtime(showtime.id)}>Save</button>
                  <button onClick={() => setEditingShowtimeId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>
                    {showtime.startTime?.slice(0,16)} - {showtime.hallName} - ${showtime.price}
                  </span>
                  <button onClick={() => setEditingShowtimeId(showtime.id)}>Edit</button>
                  <button onClick={() => onDeleteShowtime(film.id, showtime.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* 新增 showtime */}
        <AddShowtimeForm filmId={film.id} onAdd={onAddShowtime} halls={halls} />
      </div>
    </li>
  );
}
