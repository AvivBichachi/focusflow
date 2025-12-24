import { useEffect, useState } from "react";
import FocusPanel from "./components/FocusPanel.jsx";
import TaskList from "./components/TaskList.jsx";
import FocusHistory from "./components/FocusHistory";
import DailyFocusStats from "./components/DailyFocusStats";
import Header from "./components/Header";
import DashboardLayout from "./components/DashboardLayout";
import TaskForm from "./components/TaskForm.jsx";





const API_BASE = "/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState({ taskId: null, focusedAt: null });
  const [analyticsRefreshToken, setAnalyticsRefreshToken] = useState(0);


  function bumpAnalytics() {
    setAnalyticsRefreshToken((x) => x + 1);
  }


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

  async function createTask(payload) {
  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const maybeJson = await res.json().catch(() => null);
      const msg = maybeJson?.error ? `${maybeJson.error}` : `Failed to create task (${res.status})`;
      throw new Error(msg);
    }

    await fetchTasks();
  } catch (e) {
    setError(e.message || "Failed to create task");
    throw e; // חשוב כדי שה-TaskForm לא ינקה שדות במקרה כשל
  } finally {
    setLoading(false);
  }
}


  async function fetchFocus() {
    try {
      const res = await fetch(`${API_BASE}/focus`);
      if (!res.ok) throw new Error("Failed to fetch focus");
      const data = await res.json();
      setFocus(data);
    } catch (e) {
      setError(e.message || "Failed to fetch focus");
    }
  }

  async function startFocus(taskId) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/focus/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Failed to start focus");
      }
      const data = await res.json();
      setFocus(data);
    } catch (e) {
      setError(e.message || "Failed to start focus");
    }
  }

  async function stopFocus() {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/focus/stop`, { method: "POST" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Failed to stop focus");
      }
      setFocus({ taskId: null, focusedAt: null });
      bumpAnalytics();
    } catch (e) {
      setError(e.message || "Failed to stop focus");
    }
  }

  async function deleteTask(taskId) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to delete task (${res.status})`);
      }

      // If the deleted task is currently focused, clear focus in UI
      if (focus.taskId === taskId) {
        setFocus({ taskId: null, focusedAt: null });
      }

      await fetchTasks();
    } catch (e) {
      setError(e.message || "Failed to delete task");
    }

  }

  async function updateTaskStatus(taskId, status) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to update task (${res.status})`);
      }

      await fetchTasks();
    } catch (e) {
      setError(e.message || "Failed to update task");
    }
  }


  async function completeTask(taskId) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
        method: "POST",
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to complete task (${res.status})`);
      }

      await fetchTasks();
    } catch (e) {
      setError(e.message || "Failed to complete task");
    }
  }




  useEffect(() => {
    fetchTasks();
    fetchFocus();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16, fontFamily: "system-ui, Arial" }}>
      <Header />
      <DashboardLayout
        left={
          <>
            <h1 style={{ marginBottom: 8 }}>FocusFlow</h1>
            <p style={{ marginTop: 0, opacity: 0.8 }}>Minimal UI (Tasks)</p>

            <TaskForm loading={loading} onCreate={createTask} />


            {error ? (
              <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", borderRadius: 8 }}>
                <strong>Error:</strong> {error}
              </div>
            ) : null}

            <FocusPanel focus={focus} tasks={tasks} onStopFocus={stopFocus} />



            <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>Tasks</h2>
              <button
                onClick={fetchTasks}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
              >
                Refresh
              </button>
            </div>

            <TaskList
              tasks={tasks}
              focusTaskId={focus.taskId}
              onStartFocus={startFocus}
              onDelete={deleteTask}
              onComplete={completeTask}
              onUpdateStatus={updateTaskStatus}
            />
          </>
        }
        right={
          <>
            <DailyFocusStats refreshToken={analyticsRefreshToken} />
            <FocusHistory refreshToken={analyticsRefreshToken} />
          </>
        }
      />
    </div>
  );
}
