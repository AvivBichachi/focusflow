export default function DashboardLayout({ left, right }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
