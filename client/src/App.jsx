import { useEffect, useState } from "react";
import "./styles/App.css";
import AuthPage from "./components/AuthPage.jsx";
import { getToken, clearToken } from "./api/http";
import {
  listTasks,
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  updateTask as updateTaskApi,
  completeTask as completeTaskApi,
  getFocus,
  startFocus as startFocusApi,
  stopFocus as stopFocusApi,
} from "./api/focusflow.api";
import FocusPanel from "./components/FocusPanel.jsx";
import TaskList from "./components/TaskList.jsx";
import FocusHistory from "./components/FocusHistory";
import DailyFocusStats from "./components/DailyFocusStats";
import Header from "./components/Header";
import DashboardLayout from "./components/DashboardLayout";
import TaskForm from "./components/TaskForm.jsx";
import TaskDetailsModal from "./components/TaskDetailsModal.jsx";






export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState({ taskId: null, focusedAt: null });
  const [analyticsRefreshToken, setAnalyticsRefreshToken] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const heroActive = Boolean(focus?.taskId && focus?.focusedAt);
  const [authed, setAuthed] = useState(Boolean(getToken()));

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;



  function bumpAnalytics() {
    setAnalyticsRefreshToken((x) => x + 1);
  }

  function onUnauthorized() {
    clearToken();
    setAuthed(false);
  }



  async function fetchTasks() {
    setError("");
    try {
      const data = await listTasks();
      setTasks(data.items ?? []);
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to fetch tasks");
    }
  }

  async function createTask(payload) {
    setLoading(true);
    setError("");

    try {
      await createTaskApi(payload);
      await fetchTasks();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to create task");
      throw e;
    } finally {
      setLoading(false);
    }
  }



  async function fetchFocus() {
    try {
      const data = await getFocus();
      setFocus(data);
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to fetch focus");
    }
  }


  async function startFocus(taskId) {
    setError("");

    try {
      const data = await startFocusApi(taskId);
      setFocus(data);
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to start focus");
    }
  }


  async function stopFocus() {
    setError("");

    try {
      await stopFocusApi();
      setFocus({ taskId: null, focusedAt: null });
      bumpAnalytics();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to stop focus");
    }
  }


  async function deleteTask(taskId) {
    setError("");

    try {
      await deleteTaskApi(taskId);

      // If the deleted task is currently focused, clear focus in UI
      if (focus.taskId === taskId) {
        setFocus({ taskId: null, focusedAt: null });
      }

      await fetchTasks();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to delete task");
    }
  }


  async function updateTaskStatus(taskId, status) {
    setError("");

    try {
      await updateTaskApi(taskId, { status });
      await fetchTasks();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to update task");
    }
  }



  async function completeTask(taskId) {
    setError("");

    try {
      await completeTaskApi(taskId);
      await fetchTasks();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to complete task");
    }
  }


  async function saveTaskEdits(taskId, updates) {
    setError("");

    try {
      await updateTaskApi(taskId, updates);
      await fetchTasks();
    } catch (e) {
      if (e.status === 401) {
        clearToken();
        setAuthed(false);
        return;
      }
      setError(e.message || "Failed to update task");
      throw e; // כדי שהמודל לא ייצא מ-edit אם נכשל
    }
  }






  useEffect(() => {
    if (!authed) return;
    fetchTasks();
    fetchFocus();
  }, [authed]);



  if (!authed) {
    return <AuthPage onAuthed={() => setAuthed(true)} />;
  }

  return (
    <div className="appShell">
      <Header onLogout={onUnauthorized} />
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
              <DailyFocusStats refreshToken={analyticsRefreshToken} onUnauthorized={onUnauthorized} />
            </div>
          }
          bottomRight={
            <div className="panelBody">
              <FocusHistory refreshToken={analyticsRefreshToken} onUnauthorized={onUnauthorized} />
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
