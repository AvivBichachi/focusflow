import "../styles/TaskItem.css";

export default function TaskItem({ task, focusTaskId, onStartFocus, onUpdateStatus, onOpenDetails }) {
    const isCompleted = task.status === "COMPLETED";
    const nextStatus = task.status === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS";
    const toggleLabel = task.status === "IN_PROGRESS" ? "Mark TODO" : "Mark In Progress";

    return (
        <li className="taskItem">
            <div
                className="taskCard"
                role="button"
                tabIndex={0}
                onClick={() => onOpenDetails?.(task.id)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onOpenDetails?.(task.id);
                    }
                    if (e.key === " ") {
                        e.preventDefault(); // למנוע scroll
                    }
                }}
                onKeyUp={(e) => {
                    if (e.key === " ") {
                        e.preventDefault();
                        onOpenDetails?.(task.id);
                    }
                }}
            >
                <div className="taskHeader">
                    <div className="taskTitleRow">
                        <span className="taskTitle">{task.title}</span>
                        <span className="taskStatus">({task.status})</span>
                    </div>

                    <div className="taskMeta">
                        <span className={`priorityBadge p-${(task.priority || "MEDIUM").toLowerCase()}`}>
                            {task.priority || "MEDIUM"}
                        </span>
                        <span className="taskMetaSep">|</span>
                        <span>
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                        </span>
                    </div>
                </div>

                {!isCompleted ? (
                    <div
                        className="taskActions"
                        onClick={(e) => e.stopPropagation()} // מונע פתיחת modal כשנוגעים בכפתורים
                    >
                        <button
                            className="btn btnPrimary"
                            onClick={() => onStartFocus(task.id)}
                            disabled={!!focusTaskId}
                        >
                            Focus
                        </button>

                        <button
                            className="btn btnSecondary"
                            onClick={() => onUpdateStatus(task.id, nextStatus)}
                        >
                            {toggleLabel}
                        </button>
                    </div>
                ) : null}
            </div>
        </li>
    );
}
