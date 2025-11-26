import { Outlet, Link } from "react-router-dom";
import "../css/Root.css"; 


export default function Root({ user, onLogout, onLogin }) {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/tickets">Tickets</Link>
        { user && user.role === "ROLE_ADMIN" && (<>
          <Link to="/films">Films</Link>
          <Link to="/halls">Halls</Link>
        </>)}
        {user ? (
          <>
            <span> Welcome, {user.name}! </span>
            <button onClick={onLogout}>Log Out</button>
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
