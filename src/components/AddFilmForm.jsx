import { useState } from "react";

export default function AddFilmForm({ onAdd }) {
  const [newFilm, setNewFilm] = useState({
    name: "",
    intro: "",
    length: 0,
    genre: "",
    rating: 0,
    director: "",
    actors: "",   // ✅ 这里是字符串，不是数组
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newFilm.name) {
      alert("Film name is required");
      return;
    }

    // ✅ 在这里再处理 actors
    const filmToSend = {
      ...newFilm,
      actors: newFilm.actors
        .split(",")
        .map(actor => actor.trim())
        .filter(actor => actor.length > 0),
    };

    await onAdd(filmToSend);

    // 清空
    setNewFilm({
      name: "",
      intro: "",
      length: 0,
      genre: "",
      rating: 0,
      director: "",
      actors: "",
    });
  };

  return (
    <form className="add-film-form" onSubmit={handleSubmit}>
      <h3>Add New Film</h3>

      <input
        type="text"
        placeholder="Name"
        value={newFilm.name}
        onChange={(e) => setNewFilm({ ...newFilm, name: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Intro"
        value={newFilm.intro}
        onChange={(e) => setNewFilm({ ...newFilm, intro: e.target.value })}
      />

      <input
        type="number"
        placeholder="Length (min)"
        value={newFilm.length}
        onChange={(e) =>
          setNewFilm({ ...newFilm, length: parseInt(e.target.value) || 0 })
        }
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
        onChange={(e) =>
          setNewFilm({ ...newFilm, rating: parseFloat(e.target.value) || 0 })
        }
      />

      {/* ✅ Director */}
      <input
        type="text"
        placeholder="Director"
        value={newFilm.director}
        onChange={(e) =>
          setNewFilm({ ...newFilm, director: e.target.value })
        }
      />

      {/* ✅ Actors：完全原样输入，不做任何裁剪 */}
      <input
        type="text"
        placeholder="Actors (comma separated)"
        value={newFilm.actors}
        onChange={(e) =>
          setNewFilm({ ...newFilm, actors: e.target.value })
        }
      />

      <button type="submit">Add Film</button>
    </form>
  );
}
