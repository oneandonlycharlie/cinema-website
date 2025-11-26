import { useState } from "react";

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

export default function AddFilmForm({ onAdd }) {
  const [newFilm, setNewFilm] = useState({
    name: "",
    intro: "",
    length: 0,
    genre: "",
    rating: 0,
    director: "",
    actors: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newFilm.name) {
      alert("Film name is required");
      return;
    }

    const actorsArray = newFilm.actors
      .split(",")
      .map(actor => actor.trim())
      .filter(actor => actor.length > 0);

    const filmData = {
      name: newFilm.name,
      intro: newFilm.intro,
      length: newFilm.length,
      genre: newFilm.genre,
      rating: newFilm.rating,
      director: newFilm.director,
      actors: actorsArray,
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(filmData)], { type: "application/json" })
    );

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    await onAdd(formData);

    setNewFilm({
      name: "",
      intro: "",
      length: 0,
      genre: "",
      rating: 0,
      director: "",
      actors: "",
    });
    setSelectedFile(null);
  };

  return (
    <form className="add-film-form" onSubmit={handleSubmit}>
      <h3>Add New Film</h3>

      <div className="form-group">
        <label htmlFor="film-name">Name</label>
        <input
          id="film-name"
          type="text"
          value={newFilm.name}
          onChange={(e) => setNewFilm({ ...newFilm, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-intro">Introduction</label>
        <input
          id="film-intro"
          type="text"
          value={newFilm.intro}
          onChange={(e) => setNewFilm({ ...newFilm, intro: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-length">Length (min)</label>
        <input
          id="film-length"
          type="number"
          value={newFilm.length}
          onChange={(e) =>
            setNewFilm({ ...newFilm, length: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-genre">Genre</label>
        <select
          id="film-genre"
          value={newFilm.genre}
          onChange={(e) => setNewFilm({ ...newFilm, genre: e.target.value })}
        >
          <option value="">Select Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="film-rating">Rating</label>
        <input
          id="film-rating"
          type="number"
          value={newFilm.rating}
          onChange={(e) =>
            setNewFilm({ ...newFilm, rating: parseFloat(e.target.value) || 0 })
          }
          step="0.1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-director">Director</label>
        <input
          id="film-director"
          type="text"
          value={newFilm.director}
          onChange={(e) =>
            setNewFilm({ ...newFilm, director: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-actors">Actors (comma separated)</label>
        <input
          id="film-actors"
          type="text"
          value={newFilm.actors}
          onChange={(e) =>
            setNewFilm({ ...newFilm, actors: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="film-image">Cover Image</label>
        <input
          id="film-image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit">Add Film</button>
    </form>
  );
}
