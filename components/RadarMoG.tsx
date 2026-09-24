import type { RadarPoint } from "@/lib/report";

type RadarMoGProps = {
  points: RadarPoint[];
  width: number;
  height: number;
};

export function RadarMoG({ points, width, height }: RadarMoGProps) {
  if (points.length === 0) {
    return null;
  }

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;
  const maxValue = 100;
  const count = points.length;
  const angleStep = (Math.PI * 2) / count;

  const toPoint = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const r = (value / maxValue) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const polygon = points
    .map((p, i) => {
      const { x, y } = toPoint(i, p.value);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="radar-svg" viewBox={`0 0 ${width} ${height}`} aria-label="Moments of the game radar">
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={points
            .map((_, i) => {
              const { x, y } = toPoint(i, maxValue * ring);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />
      ))}
      {points.map((p, i) => {
        const outer = toPoint(i, maxValue);
        return (
          <line
            key={p.label}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
        );
      })}
      <polygon points={polygon} fill="rgba(255,255,255,0.35)" stroke="#ffffff" strokeWidth={1.5} />
      {points.map((p, i) => {
        const { x, y } = toPoint(i, p.value);
        return <circle key={`${p.label}-dot`} cx={x} cy={y} r={3} fill="#ffffff" />;
      })}
    </svg>
  );
}
