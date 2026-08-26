import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: 15,
        padding: 15,
        borderBottom: "1px solid #444",
      }}
    >
      <Link to="/todos">Todos</Link>
      <Link to="/passwords">Passwords</Link>
      <Link to="/notes">Notes</Link>
      <Link to="/bookmarks">Bookmarks</Link>
      <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
