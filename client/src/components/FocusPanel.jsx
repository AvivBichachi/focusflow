import { useEffect, useState } from "react";



function formatElapsed(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds || 0)));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;

  if (hh > 0) {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}




export default function FocusPanel({ focus, tasks, onStopFocus }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const focusedTitle =
    focus?.taskId ? tasks.find((t) => t.id === focus.taskId)?.title : null;

  useEffect(() => {
    if (!focus?.taskId || !focus?.focusedAt) {
      setElapsedSeconds(0);
      return;
    }

    function tick() {
      const startedMs = Date.parse(focus.focusedAt);
      if (Number.isNaN(startedMs)) {
        setElapsedSeconds(0);
        return;
      }
      const diff = Math.floor((Date.now() - startedMs) / 1000);
      setElapsedSeconds(diff);
    }

    tick(); // חישוב מיידי
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [focus?.taskId, focus?.focusedAt]);


  return (
    <div style={{ marginTop: 24, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Focus</h3>

      {focus?.taskId ? (
        <>
          <div style={{ marginBottom: 8 }}>
            Currently focusing on task: <strong>{focusedTitle || "Unknown task"}</strong>
          </div>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
            Elapsed: <strong>{formatElapsed(elapsedSeconds)}</strong>
          </div>

          <button onClick={onStopFocus} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
            Stop focus
          </button>
        </>
      ) : (
        <div>No active focus</div>
      )}
    </div>
  );
}
