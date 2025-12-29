import React from "react";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({
  topLeft,
  topRight,
  hero,
  bottomLeft,
  bottomRight,
}) {
  return (
    <div className="dash">
      <div className="dashTopLeft panel">{topLeft}</div>
      <div className="dashTopRight panel">{topRight}</div>

      <div className={`dashHero heroPanel ${focus?.taskId ? "isActive" : ""}`}>{hero}</div>

      <div className="dashBottomLeft panel">{bottomLeft}</div>
      <div className="dashBottomRight panel">{bottomRight}</div>
    </div>
  );
}
