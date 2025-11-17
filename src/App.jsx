import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Film from "./components/Film";
import AdminPage from "./components/AdminPage";

function RootWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetch("/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((data) => {
          setUser(data.data);  
        })
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    }
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem("jwtToken", token); // 存 token
    setUser(userData);
  }
  return <Root user={user} onLogout={handleLogout} onLogin={handleLogin}/>;
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
      { path: "films/:id", element: <Film /> },
      { path: "admin", element: <AdminPage /> },
    ],
  },
]);

export default router;

