import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

function RootWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user || null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return <Root user={user} onLogout={handleLogout} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />,
    children: [
      { index: true, element: <Home /> },
      // { path: "about", element: <About /> },
      // { path: "contact", element: <Contact /> },
      // { path: "dashboard", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      // { path: "register", element: <Register /> },
    ],
  },
]);

export default router;
