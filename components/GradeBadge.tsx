import { gradeColor } from "@/lib/report";

type GradeBadgeProps = {
  grade: string;
  fallbackColor: string;
};

export function GradeBadge({ grade, fallbackColor }: GradeBadgeProps) {
  if (!grade) {
    return <span className="badge badge--empty">Sem nota</span>;
  }

  const color = gradeColor(grade, fallbackColor);

  return (
    <span className="badge" style={{ ["--badge-color" as string]: color }}>
      <span className="badge__label">{grade}</span>
    </span>
  );
}
