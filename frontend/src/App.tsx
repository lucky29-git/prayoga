import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SpecExamplePage from "./pages/SpecExample";
import Resources from "./pages/Resources";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("uuid"));

  useEffect(() => {
    const onStorage = () => setLoggedIn(!!localStorage.getItem("uuid"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uuid");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b mb-4">
      <div className="flex gap-4 items-center">
        <Link to="/"><Button variant="link">Home</Button></Link>
        <Link to="/dashboard"><Button variant="link">Dashboard</Button></Link>
        <Link to="/spec-example"><Button variant="link">Spec Example</Button></Link>
        <Link to="/resources"><Button variant="link">Resources</Button></Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/register"><Button variant="link">Register</Button></Link>
        <Link to="/login"><Button variant="link">Login</Button></Link>
        {loggedIn && <Button variant="destructive" onClick={handleLogout}>Logout</Button>}
      </div>
    </nav>
  );
}

function AuthRedirects() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const uuid = localStorage.getItem("uuid");
    if (uuid && (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/")) {
      navigate("/dashboard", { replace: true });
    } else if (!uuid && location.pathname === "/dashboard") {
      navigate("/login", { replace: true });
    }
  }, [navigate, location]);
  return null;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AuthRedirects />
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spec-example" element={<SpecExamplePage />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
    </Router>
  );
}
