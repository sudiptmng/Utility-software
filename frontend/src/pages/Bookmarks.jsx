import { useState, useEffect } from "react";
import api from "../api/axios";

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
    try {
      await api.post("/bookmarks/", { title, url });
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
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Bookmarks</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {bookmarks.map((bm) => (
          <li
            key={bm.id}
            style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
          >
            <a
              href={bm.url}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1 }}
            >
              {bm.title}
            </a>
            <button onClick={() => handleDelete(bm.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}
    </div>
  );
}

export default Bookmarks;
