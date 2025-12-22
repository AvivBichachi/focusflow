export default function FocusPanel({ focus, tasks, onStopFocus }) {
  const focusedTitle =
    focus?.taskId ? tasks.find((t) => t.id === focus.taskId)?.title : null;

  return (
    <div style={{ marginTop: 24, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Focus</h3>

      {focus?.taskId ? (
        <>
          <div style={{ marginBottom: 8 }}>
            Currently focusing on task: <strong>{focusedTitle || "Unknown task"}</strong>
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
