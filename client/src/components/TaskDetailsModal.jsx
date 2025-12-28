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
                            <input className="input"
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
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
                                <span className={`priorityBadge p-${(task.priority || "MEDIUM").toLowerCase()}`}>
                                    {task.priority || "MEDIUM"}
                                </span>
                            ) : (
                                <select className="input" value={draftPriority} onChange={(e) => setDraftPriority(e.target.value)} >
                                    <option className="option" value="LOW">LOW</option>
                                    <option className="option" value="MEDIUM">MEDIUM</option>
                                    <option className="option" value="HIGH">HIGH</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Due date</div>
                        {!isEditing ? (
                            <div>{task.dueDate ? formatDateTime(task.dueDate) : "—"}</div>
                        ) : (
                            <input className="input"
                                type="date"
                                value={draftDueDate}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setDraftDueDate(e.target.value)}
                            />
                        )}

                    </div>

                    <div>
                        <div style={{ opacity: 0.7, fontSize: 12 }}>Description</div>
                        {!isEditing ? (
                            <div style={{ whiteSpace: "pre-wrap" }}>{task.description || "—"}</div>
                        ) : (
                            <textarea className="textarea"
                                value={draftDescription}
                                onChange={(e) => setDraftDescription(e.target.value)}
                                rows={4}
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
                            <button className="btn btnPrimary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <button className="btn btnSecondary"
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
                                >
                                    Cancel
                                </button>

                                <button className="btn btnPrimary"
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
                                >
                                    Save
                                </button>
                            </>
                        )}

                        {!isEditing && task?.status !== "COMPLETED" ? (
                            <button className="btn btnPrimary"
                                onClick={() => onComplete?.(task.id)}
                            >
                                Complete
                            </button>
                        ) : null}

                        {!isEditing ? (
                            <button className="btn btnDanger"
                                onClick={() => {
                                    if (!task) return;
                                    const ok = window.confirm(`Delete task "${task.title}"? This cannot be undone.`);
                                    if (!ok) return;
                                    onDelete?.(task.id);
                                }}
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
