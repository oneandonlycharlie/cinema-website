import { useState } from "react";

export default function AddFilmForm({ onAdd }) {
  const [newFilm, setNewFilm] = useState({
    name: "",
    intro: "",
    length: 0,
    genre: "",
    rating: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFilm.name) {
      alert("Film name is required");
      return;
    }
    await onAdd(newFilm);
    setNewFilm({ name: "", intro: "", length: 0, genre: "", rating: 0 });
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
          setNewFilm({ ...newFilm, length: parseInt(e.target.value) })
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
          setNewFilm({ ...newFilm, rating: parseFloat(e.target.value) })
        }
      />
      <button type="submit">Add Film</button>
    </form>
  );
}
