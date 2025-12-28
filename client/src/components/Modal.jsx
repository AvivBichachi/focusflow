export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={onBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          backgroundColor: "black",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          overflow: "hidden",

          // ✅ NEW: make modal constrained + column layout
          maxHeight: "min(80vh, 720px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,

            // optional: keep header from shrinking weirdly
            flex: "0 0 auto",
          }}
        >
          <div style={{ fontWeight: 700 }}>{title}</div>

          <button className="btn btnSecondary" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>

        <div
          style={{
            padding: 14,

            // ✅ NEW: this is the scroll area
            overflowY: "auto",
            minHeight: 0, // חשוב ב-flex כדי ש-overflow יעבוד
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
