export default function TaskList({ tasks, focusTaskId, onStartFocus }) {
  return (
    <ul style={{ marginTop: 12, paddingLeft: 18 }}>
      {tasks.length === 0 ? <li>No tasks yet</li> : null}

      {tasks.map((t) => (
        <li key={t.id} style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>{t.title}</span>{" "}
          <span style={{ opacity: 0.7 }}>({t.status})</span>

          <button
            onClick={() => onStartFocus(t.id)}
            disabled={!!focusTaskId}
            style={{ marginLeft: 12, padding: "4px 8px", cursor: "pointer" }}
          >
            Focus
          </button>
        </li>
      ))}
    </ul>
  );
}
