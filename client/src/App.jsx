import { useEffect, useState } from "react";

const API_BASE = "/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTasks() {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
      const data = await res.json();
      setTasks(data.items ?? []);
    } catch (e) {
      setError(e.message || "Failed to fetch tasks");
    }
  }

  async function createTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => null);
        const msg = maybeJson?.error ? `${maybeJson.error}` : `Failed to create task (${res.status})`;
        throw new Error(msg);
      }

      setTitle("");
      await fetchTasks();
    } catch (e) {
      setError(e.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginBottom: 8 }}>FocusFlow</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Minimal UI (Tasks)</p>

      <form onSubmit={createTask} style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error ? (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Tasks</h2>
        <button
          onClick={fetchTasks}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      <ul style={{ marginTop: 12, paddingLeft: 18 }}>
        {tasks.length === 0 ? <li>No tasks yet</li> : null}
        {tasks.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>{t.title}</span>{" "}
            <span style={{ opacity: 0.7 }}>({t.status})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
