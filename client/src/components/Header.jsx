export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #e5e5e5",
        marginBottom: 24,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700 }}>
        FocusFlow
      </div>

      <div style={{ fontSize: 14, opacity: 0.75 }}>
        Build deep focus, one task at a time
      </div>
    </header>
  );
}
