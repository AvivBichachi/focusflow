import Modal from "./Modal.jsx";

function formatDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

export default function TaskDetailsModal({ open, task, onClose, onComplete, onDelete }) {
    return (
        <Modal open={open} title="Task details" onClose={onClose}>
            {!task ? (
                <div>No task selected</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Title</div>
                        <div style={{ fontWeight: 700 }}>{task.title}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Status</div>
                            <div>{task.status}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Priority</div>
                            <div>{task.priority ?? "—"}</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Due date</div>
                        <div>{task.dueDate ? formatDateTime(task.dueDate) : "—"}</div>
                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Description</div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{task.description || "—"}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Created</div>
                            <div>{formatDateTime(task.createdAt)}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Updated</div>
                            <div>{formatDateTime(task.updatedAt)}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                        {task?.status !== "COMPLETED" ? (
                            <button
                                onClick={() => onComplete?.(task.id)}
                                style={{
                                    border: "1px solid #ccc",
                                    background: "black",
                                    borderRadius: 8,
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                }}
                            >
                                Complete
                            </button>
                        ) : null}

                        <button
                            onClick={() => onDelete?.(task.id)}
                            style={{
                                border: "1px solid #ccc",
                                background: "black",
                                borderRadius: 8,
                                padding: "8px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Delete
                        </button>
                    </div>

                </div>
            )}
        </Modal>
    );
}
