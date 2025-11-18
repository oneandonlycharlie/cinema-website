import { useState, useEffect } from "react";

export default function AddShowtimeForm({ filmId, onAdd }) {
  const [form, setForm] = useState({
    startTime: "",
    hallId: "", // 保存 hall ID
    price: 0,
  });
  const [halls, setHalls] = useState([]);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const res = await fetch("/api/halls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setHalls(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.hallId) {
      alert("Please select a hall");
      return;
    }
    await onAdd(filmId, form);
    setForm({ startTime: "", hallId: "", price: 0 });
  };

  return (
    <div className="showtime-form">
      <input
        type="datetime-local"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      <select
        value={form.hallId}
        onChange={(e) => setForm({ ...form, hallId: parseInt(e.target.value) })}
      >
        <option value="">Select Hall</option>
        {halls.map((hall) => (
          <option key={hall.id} value={hall.id}>
            {hall.name} {/* 展示名字 */}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <button onClick={handleSubmit}>Add showtime</button>
    </div>
  );
}
