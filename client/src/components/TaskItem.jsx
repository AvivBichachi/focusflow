export default function TaskItem({ task, focusTaskId, onStartFocus, onDelete, onComplete, onUpdateStatus, onOpenDetails }) {
    const isCompleted = task.status === "COMPLETED";
    const canToggleProgress = !isCompleted;
    const nextStatus = task.status === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS";
    const toggleLabel = task.status === "IN_PROGRESS" ? "Mark TODO" : "Mark In Progress";

    return (
        <li style={{ marginBottom: 10 }}>
            <div
                onClick={(e) => {
                        e.stopPropagation();
                         onOpenDetails?.(task.id);}}
                style={{ cursor: "pointer" }}
            >
                <div>
                    <span style={{ fontWeight: 600 }}>{task.title}</span>{" "}
                    <span style={{ opacity: 0.7 }}>({task.status})</span>
                </div>

                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                    <span>Priority: {task.priority ?? "—"}</span>{" | "}
                    <span>
                        Due: {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "—"}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStartFocus(task.id);}}
                    disabled={!!focusTaskId}
                    style={{ marginTop: 6, padding: "4px 8px", cursor: "pointer" }}
                >
                    Focus
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(task.id, nextStatus);}}
                    disabled={!canToggleProgress}
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                >
                    {toggleLabel}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onComplete(task.id);}}
                    disabled={isCompleted}
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                >
                    Complete
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);}}
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                >
                    Delete
                </button>
            </div>
        </li>
    );
}
