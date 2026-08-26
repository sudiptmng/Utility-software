import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Pages.css";

function Passwords() {
  const [entries, setEntries] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const response = await api.get("/passwords/");
      setEntries(response.data);
    } catch (err) {
      console.error("Failed to fetch passwords", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!siteName.trim() || !username.trim() || !password.trim()) return;
    try {
      await api.post("/passwords/", {
        site_name: siteName,
        username,
        password,
      });
      setSiteName("");
      setUsername("");
      setPassword("");
      fetchEntries();
    } catch (err) {
      console.error("Failed to add password entry", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/passwords/${id}/`);
      fetchEntries();
    } catch (err) {
      console.error("Failed to delete password entry", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Passwords</h2>

      <div className="form-card">
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <ul className="item-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <span>
              <strong>{entry.site_name}</strong> — {entry.username}
            </span>
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {entries.length === 0 && <p className="empty-state">No entries yet.</p>}
    </div>
  );
}

export default Passwords;
