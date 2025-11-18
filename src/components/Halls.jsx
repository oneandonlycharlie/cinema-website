import { useEffect, useState } from "react";

export default function HallAdminPage() {
  const [halls, setHalls] = useState([]);
  const [newHall, setNewHall] = useState({ name: "", capacity: 0 });
  const [editingHall, setEditingHall] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    const res = await fetch("/api/halls", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    console.warn(result)
    if (res.ok) setHalls(result.data);
  };

  const addHall = async () => {
    await fetch("/api/halls", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(newHall),
    });
    fetchHalls();
    setNewHall({ name: "", capacity: 0 });
  };

  const updateHall = async (id) => {
    await fetch(`/api/halls/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(editingHall),
    });
    setEditingHall(null);
    fetchHalls();
  };

  const deleteHall = async (id) => {
    await fetch(`/api/halls/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchHalls();
  };

  return (
    <div className="admin-container">
      <h1>🏟️ Hall Management</h1>

      {/* Add hall */}
      <div>
        <input placeholder="Hall name" value={newHall.name} onChange={e => setNewHall({ ...newHall, name: e.target.value })} />
        <input type="number" placeholder="Capacity" value={newHall.capacity} onChange={e => setNewHall({ ...newHall, capacity: e.target.value })} />
        <button onClick={addHall}>Add Hall</button>
      </div>

      <ul>
        {halls.map(h => (
          <li key={h.id}>
            {editingHall?.id === h.id ? (
              <>
                <input value={editingHall.name} onChange={e => setEditingHall({ ...editingHall, name: e.target.value })} />
                <input type="number" value={editingHall.capacity} onChange={e => setEditingHall({ ...editingHall, capacity: e.target.value })} />
                <button onClick={() => updateHall(h.id)}>Save</button>
                <button onClick={() => setEditingHall(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{h.name}</strong> - {h.capacity} seats
                <button onClick={() => setEditingHall(h)}>Edit</button>
                <button onClick={() => deleteHall(h.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
