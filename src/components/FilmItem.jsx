// FilmItem.jsx
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
}) {
  return (
    <li className="film-item">
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
        <h3>showtimes</h3>
        <ul>
          {film.showtimes?.map((showtime) => (
            <li key={showtime.id}>
              <input
                type="datetime-local"
                value={showtime.startTime?.slice(0, 16)}
                onChange={(e) =>
                  onUpdateShowtime(showtime.id, {
                    ...showtime,
                    startTime: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={showtime.hall}
                onChange={(e) =>
                  onUpdateShowtime(showtime.id, {
                    ...showtime,
                    hall: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={showtime.price}
                onChange={(e) =>
                  onUpdateShowtime(showtime.id, {
                    ...showtime,
                    price: Number(e.target.value),
                  })
                }
              />
              <button onClick={() => onDeleteShowtime(showtime.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* 新增 showtime（独立组件） */}
        <AddShowtimeForm filmId={film.id} onAdd={onAddShowtime} />
      </div>
    </li>
  );
}
