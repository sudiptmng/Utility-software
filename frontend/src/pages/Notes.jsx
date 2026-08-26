import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Pages.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

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
      setSelectedNote(null);
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Notes</h2>

      <div className="form-card">
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <ul className="item-list">
        {notes.map((note) => (
          <li
            key={note.id}
            className="note-row"
            onClick={() => setSelectedNote(note)}
          >
            <span>
              <strong>{note.title}</strong>
              <p>{note.content}</p>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(note.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {notes.length === 0 && <p className="empty-state">No notes yet.</p>}

      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div
            className="modal-card note-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedNote.title}</h3>
            <p className="note-modal-content">{selectedNote.content}</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setSelectedNote(null)}>
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedNote.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
