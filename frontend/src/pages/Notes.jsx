import { useState, useEffect } from "react";
import api from "../api/axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes/");
      setNotes(response.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/notes/", { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}/`);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Notes</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: 10 }}>
            <strong>{note.title}</strong>
            <p style={{ margin: "4px 0" }}>{note.content}</p>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {notes.length === 0 && <p>No notes yet.</p>}
    </div>
  );
}

export default Notes;
