import '../styles/DashboardLayout.css'

export default function DashboardLayout({ topLeft, topRight, hero, bottomLeft, bottomRight, heroActive }) {
  return (
    <div className="dash">
      <div className="dashTopLeft panel">{topLeft}</div>
      <div className="dashTopRight panel">{topRight}</div>

      <div className={`dashHero heroPanel ${heroActive ? "isActive" : ""}`}>
        {hero}
      </div>

      <div className="dashBottomLeft panel">{bottomLeft}</div>
      <div className="dashBottomRight panel">{bottomRight}</div>
    </div>
  );
}
