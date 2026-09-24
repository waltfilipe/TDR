import { GRADE_SCALE, GRADE_TOKENS } from "@/lib/report";

export function GradeLegend() {
  return (
    <ul className="legend" aria-label="Escala de notas">
      {GRADE_SCALE.map((grade) => (
        <li key={grade} className="legend__item">
          <span className="legend__dot" style={{ backgroundColor: GRADE_TOKENS[grade].color }} />
          {grade}
        </li>
      ))}
    </ul>
  );
}
