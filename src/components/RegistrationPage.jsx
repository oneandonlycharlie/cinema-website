import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/RegistrationPage.css";

const ENDPOINT = "/api/auth/register"; 

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const validate = () => {
    if (!form.email.trim() || !form.name.trim() || !form.password) {
      setError("Email, name, and password are required");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim(),
          password: form.password,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMsg(payload?.message || "Registration successful, please log in");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(payload?.message || payload?.error || `Registration failed (${res.status})`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <div className="alert error">{error}</div>}
        {successMsg && <div className="alert success">{successMsg}</div>}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="you@example.com"
            disabled={loading}
          />
        </label>

        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Your name"
            disabled={loading}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            placeholder="At least 6 characters"
            disabled={loading}
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="small">
          Already have an account?{" "}
          <button type="button" className="link" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
