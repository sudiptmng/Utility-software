import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Pages.css";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos/");
      setTodos(response.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/todos/", { title });
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await api.patch(`/todos/${todo.id}/`, {
        is_completed: !todo.is_completed,
      });
      fetchTodos();
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}/`);
      fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Todos</h2>

      <div className="form-card">
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="New todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <ul className="item-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={() => toggleComplete(todo)}
            />
            <span
              style={{
                textDecoration: todo.is_completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty-state">No todos yet.</p>}
    </div>
  );
}

export default Todos;
