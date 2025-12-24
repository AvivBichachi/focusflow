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
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title..."
                    style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                />

                <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                </select>

                <input
                    type="date"
                    value={dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                />
            </div>

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)..."
                rows={3}
                style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
        </form>
    );
}
