import { GRADE_SCALE, gradeColor, gradeLevel } from "@/lib/report";

type GradeBadgeProps = {
  grade: string;
  fallbackColor: string;
};

export function GradeBadge({ grade, fallbackColor }: GradeBadgeProps) {
  if (!grade) {
    return <span className="badge badge--empty">Sem nota</span>;
  }

  const color = gradeColor(grade, fallbackColor);
  const level = gradeLevel(grade);

  return (
    <span className="badge" style={{ ["--badge-color" as string]: color }}>
      <span className="badge__label">{grade}</span>
      <span className="badge__meter" aria-hidden="true">
        {GRADE_SCALE.map((_, index) => (
          <i key={index} className={index < level ? "is-on" : undefined} />
        ))}
      </span>
      <span className="sr-only">{`Nível ${level} de ${GRADE_SCALE.length}`}</span>
    </span>
  );
}
