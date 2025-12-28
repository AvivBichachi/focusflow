import { useState } from "react";

export default function TaskForm({ loading, onCreate }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const trimmed = title.trim();
        if (!trimmed || loading) return;

        if (dueDate) {
            const today = new Date().toISOString().split("T")[0];
            if (dueDate < today) {
                return;
            }
        }


        await onCreate({
            title: trimmed,
            description: description.trim() ? description.trim() : null,
            priority,
            dueDate: dueDate ? dueDate : null,
        });

        // איפוס אחרי הצלחה (App יזרוק error אם נכשל)
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDueDate("");
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div className="row">
                <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title..."
                />

                <button
                    className="btn btnPrimary"
                    type="submit"
                    disabled={loading || !title.trim()}
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <div className="priorityToggle" role="group" aria-label="Task priority">
                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                        <button
                            key={p}
                            type="button"
                            className={`priorityPill ${priority === p ? "isActive" : ""}`}
                            onClick={() => setPriority(p)}
                            aria-pressed={priority === p}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <input
                    className="input"
                    type="date"
                    value={dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)..."
                rows={3}
            />
        </form>
    );
}
