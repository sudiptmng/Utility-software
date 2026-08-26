import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Pages.css";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const response = await api.get("/bookmarks/");
      setBookmarks(response.data);
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      await api.post("/bookmarks/", { title, url: formattedUrl });
      setTitle("");
      setUrl("");
      fetchBookmarks();
    } catch (err) {
      console.error("Failed to add bookmark", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}/`);
      fetchBookmarks();
    } catch (err) {
      console.error("Failed to delete bookmark", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Bookmarks</h2>

      <div className="form-card">
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <ul className="item-list">
        {bookmarks.map((bm) => (
          <li key={bm.id}>
            <a href={bm.url} target="_blank" rel="noreferrer">
              {bm.title}
            </a>
            <button onClick={() => handleDelete(bm.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {bookmarks.length === 0 && (
        <p className="empty-state">No bookmarks yet.</p>
      )}
    </div>
  );
}

export default Bookmarks;
