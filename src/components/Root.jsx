import { Outlet, Link } from "react-router-dom";
import "../css/Root.css"; 


export default function Root({ user, onLogout }) {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/dashboard">Dashboard</Link>

        {user ? (
          <>
            <span> Welcome, {user.name}! </span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
