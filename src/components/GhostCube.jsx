import React from "react";

export default function GhostCube({ size = 120, className = "", slow = false }) {
  return (
    <div
      className={`pointer-events-none absolute opacity-[0.07] ${slow ? "animate-ghost-cube-slow" : "animate-ghost-cube"} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" strokeWidth="0.5">
        {/* Front face */}
        <polygon points="20,30 80,30 80,80 20,80" />
        {/* Back face */}
        <polygon points="35,15 95,15 95,65 35,65" />
        {/* Connectors */}
        <line x1="20" y1="30" x2="35" y2="15" />
        <line x1="80" y1="30" x2="95" y2="15" />
        <line x1="80" y1="80" x2="95" y2="65" />
        <line x1="20" y1="80" x2="35" y2="65" />
      </svg>
    </div>
  );
}