import { useEffect, useState } from "react";
import { formatHms } from "../utils/formatTime.js";
import { apiFetch } from "../api/http";

function formatLocal(isoOrNull) {
  if (!isoOrNull) return "—";
  const d = new Date(isoOrNull);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function FocusHistory({ refreshToken, onUnauthorized }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSessions() {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/focus/sessions?limit=20");
      setItems(data.items ?? []);
    } catch (e) {
      if (e.status === 401) {
        onUnauthorized?.();
        return;
      }
      setError(e.message || "Failed to fetch focus sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, [refreshToken]);

  return (
    <div style={{ marginTop: 32, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Focus History</h2>
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
        <div style={{ marginTop: 12, paddingRight: 6 }}>
          <ul style={{ marginTop: 0, paddingLeft: 18 }}>
            {items.map((s) => (
              <li key={s.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{s.taskTitle ?? "Unknown task"}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Duration: {formatHms(s.durationSeconds)}{" | "}
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
