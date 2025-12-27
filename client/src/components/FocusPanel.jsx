import { useEffect, useMemo, useState } from "react";
import "../styles/FocusPanel.css";

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

  const isActive = Boolean(focus?.taskId && focus?.focusedAt);

  const focusedTitle = useMemo(() => {
    if (!focus?.taskId) return null;
    return tasks.find((t) => t.id === focus.taskId)?.title ?? null;
  }, [focus?.taskId, tasks]);

  useEffect(() => {
    if (!isActive) {
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

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isActive, focus?.focusedAt]);

  return (
    <div className={`focusHero ${isActive ? "isActive" : "isIdle"}`}>
      <div className="focusHeroHeader">
        <div className="focusHeroTitle">Focus</div>
        <div className="focusHeroMeta">
          {isActive ? `Started: ${new Date(focus.focusedAt).toLocaleTimeString()}` : "No active session"}
        </div>
      </div>

      <div className="focusTimer" aria-label="elapsed time">
        {isActive ? formatElapsed(elapsedSeconds) : "00:00"}
      </div>

      <div className="focusTaskTitle">
        {isActive ? (
          <>
            Focusing on <span className="focusTaskStrong">{focusedTitle || "Unknown task"}</span>
          </>
        ) : (
          "Pick a task and click Focus to start."
        )}
      </div>

      <div className="focusActions">
        {isActive ? (
          <button className="focusBtn focusBtnDanger" onClick={onStopFocus}>
            Stop
          </button>
        ) : (
          <div className="focusHint">
            Tip: use the <strong>Focus</strong> button on a task in the list.
          </div>
        )}
      </div>
    </div>
  );
}
