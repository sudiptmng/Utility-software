import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/todos">Todos</Link>
        <Link to="/passwords">Passwords</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/bookmarks">Bookmarks</Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
