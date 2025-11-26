import { useState, useEffect } from "react";
import AddShowtimeForm from "./AddShowTimeForm";
import.meta.env.VITE_API_BASE_URL;

const GENRES = [
  "DRAMA",
  "COMEDY",
  "ROMANCE",
  "HORROR",
  "DOCUMENTARY",
  "ACTION",
  "SCI_FI",
  "ANIMATION"
];

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
  const [selectedFile, setSelectedFile] = useState(null);
  const imageFullUrl = `${import.meta.env.VITE_API_BASE_URL}${film.coverImageUrl}`;
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

const handleSaveFilm = () => {
  const filmData = {
    id: film.id,
    name: editingFilm.name,
    intro: editingFilm.intro,
    length: editingFilm.length,
    genre: editingFilm.genre,
    rating: editingFilm.rating,
  };

  const formData = new FormData();

  // ✅ 必须封装 data
  formData.append(
    "data",
    new Blob([JSON.stringify(filmData)], { type: "application/json" })
  );

  // ✅ 图片字段名必须为 image
  if (selectedFile) {
    formData.append("image", selectedFile);
  }

  onSaveFilm(film.id, formData);
  setSelectedFile(null);
};

  return (
<li className="film-item">
  {editingFilm?.id === film.id ? (
    <>
      <div className="form-group">
        <label htmlFor={`film-name-${film.id}`}>Film Name</label>
        <input
          id={`film-name-${film.id}`}
          type="text"
          value={editingFilm.name}
          onChange={(e) =>
            setEditingFilm({ ...editingFilm, name: e.target.value })
          }
          placeholder="Film Name"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`film-intro-${film.id}`}>Introduction</label>
        <input
          id={`film-intro-${film.id}`}
          type="text"
          value={editingFilm.intro}
          onChange={(e) =>
            setEditingFilm({ ...editingFilm, intro: e.target.value })
          }
          placeholder="Introduction"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`film-length-${film.id}`}>Duration (min)</label>
        <input
          id={`film-length-${film.id}`}
          type="number"
          value={editingFilm.length}
          onChange={(e) =>
            setEditingFilm({
              ...editingFilm,
              length: parseInt(e.target.value),
            })
          }
          placeholder="Duration (min)"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`film-genre-${film.id}`}>Genre</label>
        <select
          id={`film-genre-${film.id}`}
          value={editingFilm.genre || ""}
          onChange={(e) =>
            setEditingFilm({ ...editingFilm, genre: e.target.value })
          }
        >
          <option value="">Select Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={`film-image-${film.id}`}>Cover Image</label>
        <input
          id={`film-image-${film.id}`}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="form-group" style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleSaveFilm}>Save</button>
        <button onClick={() => setEditingFilm(null)}>Cancel</button>
      </div>
    </>
  ) : (
    <>
      <h2>{film.name}</h2>
      <p>{film.intro}</p>
      <p>Duration: {film.length} min</p>
      <p>Genre: {film.genre}</p>
      {film.coverImageUrl && (
        <img
          src={imageFullUrl}
          alt="Cover"
          style={{ width: "150px", borderRadius: "8px" }}
        />
      )}
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
              <div className="form-group">
                <label htmlFor={`showtime-${showtime.id}-start`}>
                  Start Time
                </label>
                <input
                  id={`showtime-${showtime.id}-start`}
                  type="datetime-local"
                  value={showtime.startTime?.slice(0, 16)}
                  onChange={(e) =>
                    handleShowtimeChangeLocally(
                      showtime.id,
                      "startTime",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor={`showtime-${showtime.id}-hall`}>Hall</label>
                <select
                  id={`showtime-${showtime.id}-hall`}
                  value={showtime.hallId || ""}
                  onChange={(e) =>
                    handleShowtimeChangeLocally(
                      showtime.id,
                      "hallId",
                      parseInt(e.target.value)
                    )
                  }
                >
                  <option value="">Select Hall</option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor={`showtime-${showtime.id}-price`}>Price</label>
                <input
                  id={`showtime-${showtime.id}-price`}
                  type="number"
                  value={showtime.price}
                  onChange={(e) =>
                    handleShowtimeChangeLocally(
                      showtime.id,
                      "price",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="form-group">
                <button onClick={() => saveShowtime(showtime.id)}>Save</button>
                <button onClick={() => setEditingShowtimeId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <span>
                {showtime.startTime?.slice(0, 16)} - {showtime.hallName} - $
                {showtime.price}
              </span>
              <button onClick={() => setEditingShowtimeId(showtime.id)}>Edit</button>
              <button onClick={() => onDeleteShowtime(film.id, showtime.id)}>
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>

    <AddShowtimeForm filmId={film.id} onAdd={onAddShowtime} halls={halls} />
  </div>
</li>
  );
}
