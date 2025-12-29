import { useEffect, useState } from "react";
import "./styles/App.css";
import FocusPanel from "./components/FocusPanel.jsx";
import TaskList from "./components/TaskList.jsx";
import FocusHistory from "./components/FocusHistory";
import DailyFocusStats from "./components/DailyFocusStats";
import Header from "./components/Header";
import DashboardLayout from "./components/DashboardLayout";
import TaskForm from "./components/TaskForm.jsx";
import TaskDetailsModal from "./components/TaskDetailsModal.jsx";





const API_BASE = "/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState({ taskId: null, focusedAt: null });
  const [analyticsRefreshToken, setAnalyticsRefreshToken] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const heroActive = Boolean(focus?.taskId && focus?.focusedAt);


  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;



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

  async function saveTaskEdits(taskId, updates) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to update task (${res.status})`);
      }

      await fetchTasks();
    } catch (e) {
      setError(e.message || "Failed to update task");
      throw e; // כדי שהמודל לא ייצא מ-edit אם נכשל
    }
  }





  useEffect(() => {
    fetchTasks();
    fetchFocus();
  }, []);

  return (
    <div className="appShell">
      <Header />
      <div className="appMain">
        <DashboardLayout
          topLeft={
            <>
              <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>Add Your Task</h2>

              <TaskForm loading={loading} onCreate={createTask} />


              {error ? (
                <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", borderRadius: 8 }}>
                  <strong>Error:</strong> {error}
                </div>
              ) : null}

            </>
          }
          topRight={
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tasks</h2>
                <button className="btn" onClick={fetchTasks}>Refresh</button>
              </div>

              <div className="panelBody">
                <TaskList
                  tasks={tasks}
                  focusTaskId={focus.taskId}
                  onStartFocus={startFocus}
                  onUpdateStatus={updateTaskStatus}
                  onOpenDetails={(taskId) => setSelectedTaskId(taskId)}
                />
              </div>
            </>
          }


          hero={<FocusPanel focus={focus} tasks={tasks} onStopFocus={stopFocus} />}
          heroActive={heroActive}
          bottomLeft={
            <div className="panelBody">
              <DailyFocusStats refreshToken={analyticsRefreshToken} />
            </div>
          }
          bottomRight={
            <div className="panelBody">
              <FocusHistory refreshToken={analyticsRefreshToken} />
            </div>
          }
        />
        <TaskDetailsModal
          open={!!selectedTaskId}
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onComplete={async (taskId) => {
            await completeTask(taskId);
            setSelectedTaskId(null);
          }}
          onDelete={async (taskId) => {
            await deleteTask(taskId);
            setSelectedTaskId(null);
          }}
          onSave={saveTaskEdits}
        />
      </div>
    </div>
  );
}
