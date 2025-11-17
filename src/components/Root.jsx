import { Outlet, Link } from "react-router-dom";
import "../css/Root.css"; 


export default function Root({ user, onLogout, onLogin }) {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin Page</Link>
        <Link to="/contact">XX</Link>
        <Link to="/dashboard">XX</Link>

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

      <Outlet context={{ onLogin }} />
    </div>
  );
}
