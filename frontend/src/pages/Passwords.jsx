import { useState, useEffect } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Pages.css";

function Passwords() {
  const [entries, setEntries] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [revealedIds, setRevealedIds] = useState({});
  const [modalEntryId, setModalEntryId] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [modalError, setModalError] = useState("");

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

  const openRevealModal = (id) => {
    setModalEntryId(id);
    setLoginPassword("");
    setModalError("");
  };

  const closeModal = () => {
    setModalEntryId(null);
    setLoginPassword("");
    setModalError("");
  };

  const handleRevealSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    try {
      const response = await api.post(`/passwords/${modalEntryId}/reveal/`, {
        login_password: loginPassword,
      });
      setRevealedIds((prev) => ({
        ...prev,
        [modalEntryId]: response.data.password,
      }));
      closeModal();
    } catch (err) {
      setModalError("Incorrect password");
    }
  };

  const hidePassword = (id) => {
    setRevealedIds((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
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
        {entries.map((entry) => {
          const isRevealed = revealedIds[entry.id];
          return (
            <li key={entry.id} className="password-row">
              <span className="password-row-info">
                <div className="site-name">{entry.site_name}</div>
                <div className="row-username">{entry.username}</div>
                <div className="row-password">
                  {isRevealed ? isRevealed : "••••••••••"}
                </div>
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  isRevealed
                    ? hidePassword(entry.id)
                    : openRevealModal(entry.id)
                }
              >
                <FontAwesomeIcon icon={isRevealed ? faEyeSlash : faEye} />
              </button>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </li>
          );
        })}
      </ul>

      {entries.length === 0 && <p className="empty-state">No entries yet.</p>}

      {modalEntryId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm your login password</h3>
            <form onSubmit={handleRevealSubmit}>
              <input
                type="password"
                placeholder="Your login password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoFocus
              />
              {modalError && <p className="error-text">{modalError}</p>}
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Reveal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Passwords;
