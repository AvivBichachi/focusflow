export default function TaskItem({ task, focusTaskId, onStartFocus, onUpdateStatus, onOpenDetails }) {
    const isCompleted = task.status === "COMPLETED";
    const canToggleProgress = !isCompleted;
    const nextStatus = task.status === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS";
    const toggleLabel = task.status === "IN_PROGRESS" ? "Mark TODO" : "Mark In Progress";

    return (
        <li style={{ marginBottom: 10 }}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails?.(task.id);
                }}
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
                {!isCompleted ? (
                    <button className="btn btnPrimary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStartFocus(task.id);
                        }}
                        disabled={!!focusTaskId}
                    >
                        Focus
                    </button>
                ) : null}
                
                {!isCompleted ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(task.id, nextStatus);
                        }}
                        style={{ padding: "4px 8px", cursor: "pointer" }}
                    >
                        {toggleLabel}
                    </button>
                ) : null}


            </div>
        </li>
    );
}
