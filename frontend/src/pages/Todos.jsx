import { useState, useEffect } from "react";
import api from "../api/axios";

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
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Todos</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "70%", marginRight: 10 }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={() => toggleComplete(todo)}
              style={{ marginRight: 10 }}
            />
            <span
              style={{
                textDecoration: todo.is_completed ? "line-through" : "none",
                flex: 1,
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>No todos yet.</p>}
    </div>
  );
}

export default Todos;
