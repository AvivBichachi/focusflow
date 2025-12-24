import { useEffect, useState } from "react";

const API_BASE = "/api";

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  const s = Math.max(0, Number(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

function formatLocal(isoOrNull) {
  if (!isoOrNull) return "—";
  const d = new Date(isoOrNull);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function FocusHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSessions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/focus/sessions?limit=20`);
      if (!res.ok) throw new Error(`Failed to fetch focus sessions (${res.status})`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      setError(e.message || "Failed to fetch focus sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div style={{ marginTop: 32, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Focus History</h2>
        <button
          onClick={fetchSessions}
          disabled={loading}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {!error && !loading && items.length === 0 ? (
        <div style={{ marginTop: 12, opacity: 0.7 }}>No focus sessions yet</div>
      ) : null}

      {items.length > 0 ? (
        <div style={{ marginTop: 12, maxHeight: 420, overflowY: "auto", paddingRight: 6 }}>
          <ul style={{ marginTop: 0, paddingLeft: 18 }}>
            {items.map((s) => (
              <li key={s.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{s.taskTitle ?? "Unknown task"}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Duration: {formatDuration(s.durationSeconds)}{" | "}
                  Start: {formatLocal(s.startedAt)}{" | "}
                  End: {formatLocal(s.endedAt)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
