import { useEffect, useMemo, useState } from "react";
import { formatHms } from "../utils/formatTime.js";
import { apiFetch } from "../api/http";

export default function DailyFocusStats({ refreshToken, onUnauthorized }) {
  const [days, setDays] = useState(7);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tz = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }, []);

  async function fetchDaily() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        days: String(days),
        tz,
      });

      const data = await apiFetch(`/api/focus/stats/daily?${params.toString()}`);
      setItems(data.items ?? []);
    } catch (e) {
      if (e.status === 401) {
        onUnauthorized?.();
        return;
      }
      setError(e.message || "Failed to fetch daily stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDaily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, refreshToken]);

  return (
    <div style={{ marginTop: 32, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Daily Focus Stats</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>
            Days:
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ marginLeft: 6, padding: "6px 8px", borderRadius: 8, border: "1px solid #ccc" }}
            >
              <option value={1}>1</option>
              <option value={7}>7</option>
              <option value={14}>14</option>
              <option value={30}>30</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Timezone: {tz}</div>

      {error ? (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {!error && !loading && items.length === 0 ? (
        <div style={{ marginTop: 12, opacity: 0.7 }}>No daily stats yet</div>
      ) : null}

      {items.length > 0 ? (
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {items.map((d) => (
            <li key={d.date} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{d.date}</span>{" "}
              <span style={{ opacity: 0.8 }}>— {formatHms(d.totalSeconds)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
