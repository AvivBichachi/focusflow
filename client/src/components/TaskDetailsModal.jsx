import Modal from "./Modal.jsx";
import { useEffect, useState } from "react";

function formatDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

export default function TaskDetailsModal({ open, task, onClose, onComplete, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);

    const [draftTitle, setDraftTitle] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [draftPriority, setDraftPriority] = useState("MEDIUM");
    const [draftDueDate, setDraftDueDate] = useState(""); // YYYY-MM-DD
    const [draftStatus, setDraftStatus] = useState("TODO");

    useEffect(() => {
        if (!task) return;
        setIsEditing(false);

        setDraftTitle(task.title ?? "");
        setDraftDescription(task.description ?? "");
        setDraftPriority(task.priority ?? "MEDIUM");
        setDraftStatus(task.status ?? "TODO");

        // dueDate מגיע אצלכם כ-ISO או null. נהפוך ל-YYYY-MM-DD ל-input date
        const iso = task.dueDate ? new Date(task.dueDate) : null;
        const yyyyMmDd = iso && !Number.isNaN(iso.getTime()) ? iso.toISOString().slice(0, 10) : "";
        setDraftDueDate(yyyyMmDd);
    }, [task?.id]);

    return (
        <Modal open={open} title="Task details" onClose={onClose}>
            {!task ? (
                <div>No task selected</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Title</div>
                        {!isEditing ? (
                            <div style={{ fontWeight: 700 }}>{task.title}</div>
                        ) : (
                            <input
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
                                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                            />
                        )}

                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Status</div>
                            <div>{task.status}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Priority</div>
                            {!isEditing ? (
                                <div>{task.priority}</div>
                            ) : (
                                <select value={draftPriority} onChange={(e) => setDraftPriority(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Due date</div>
                        {!isEditing ? (
                            <div>{task.dueDate ? formatDateTime(task.dueDate) : "—"}</div>
                        ) : (
                            <input
                                type="date"
                                value={draftDueDate}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setDraftDueDate(e.target.value)}
                                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                            />
                        )}

                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Description</div>
                        {!isEditing ? (
                            <div style={{ whiteSpace: "pre-wrap" }}>{task.description || "—"}</div>
                        ) : (
                            <textarea
                                value={draftDescription}
                                onChange={(e) => setDraftDescription(e.target.value)}
                                rows={4}
                                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                            />
                        )}

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
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ border: "1px solid #ccc", background: "black", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        // revert draft back to task values
                                        if (!task) return;
                                        setIsEditing(false);
                                        setDraftTitle(task.title ?? "");
                                        setDraftDescription(task.description ?? "");
                                        setDraftPriority(task.priority ?? "MEDIUM");
                                        setDraftStatus(task.status ?? "TODO");
                                        const iso = task.dueDate ? new Date(task.dueDate) : null;
                                        const yyyyMmDd = iso && !Number.isNaN(iso.getTime()) ? iso.toISOString().slice(0, 10) : "";
                                        setDraftDueDate(yyyyMmDd);
                                    }}
                                    style={{ border: "1px solid #ccc", background: "black", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!task) return;

                                        const title = draftTitle.trim();
                                        if (!title) return;

                                        // UI dueDate הוא YYYY-MM-DD. אם ריק -> null.
                                        const dueDate = draftDueDate ? draftDueDate : null;

                                        const updates = {
                                            title,
                                            description: draftDescription.trim() ? draftDescription.trim() : null,
                                            priority: draftPriority,
                                            dueDate,
                                            status: draftStatus,
                                        };

                                        await onSave?.(task.id, updates);
                                        setIsEditing(false);
                                    }}
                                    style={{ border: "1px solid #ccc", background: "black", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
                                >
                                    Save
                                </button>
                            </>
                        )}

                        {!isEditing && task?.status !== "COMPLETED" ? (
                            <button
                                onClick={() => onComplete?.(task.id)}
                                style={{ border: "1px solid #ccc", background: "black", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
                            >
                                Complete
                            </button>
                        ) : null}

                        {!isEditing ? (
                            <button
                                onClick={() => {
                                    if (!task) return;
                                    const ok = window.confirm(`Delete task "${task.title}"? This cannot be undone.`);
                                    if (!ok) return;
                                    onDelete?.(task.id);
                                }}
                                style={{ border: "1px solid #ccc", background: "black", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
                            >
                                Delete
                            </button>
                        ) : null}
                    </div>

                </div>
            )}
        </Modal>
    );
}
