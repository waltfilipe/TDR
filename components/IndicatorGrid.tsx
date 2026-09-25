import { GradeBadge } from "@/components/GradeBadge";
import { gradeColor } from "@/lib/report";

type Indicator = {
  key: string;
  label: string;
  grade: string;
  color: string;
};

type IndicatorGridProps = {
  indicators: Indicator[];
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
  /** When true with 4 columns, items stack as pairs per column (column-major). */
  columnPairs?: boolean;
};

export function IndicatorGrid({
  indicators,
  emptyMessage,
  columns = 2,
  columnPairs = false,
}: IndicatorGridProps) {
  if (indicators.length === 0) {
    return <p className="empty-note">{emptyMessage ?? "No indicators on file."}</p>;
  }

  const colClass = columns === 4 ? " indicator-grid--4" : columns === 3 ? " indicator-grid--3" : columns === 2 ? " indicator-grid--2" : "";
  const pairClass = columnPairs && columns === 4 ? " indicator-grid--pairs" : "";

  return (
    <ul
      className={`indicator-grid${colClass}${pairClass}`}
      style={colClass ? undefined : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {indicators.map((indicator) => (
        <li
          key={indicator.key}
          className="indicator"
          style={
            indicator.grade
              ? { ["--indicator-color" as string]: gradeColor(indicator.grade, indicator.color) }
              : undefined
          }
        >
          <span className="indicator__label">{indicator.label}</span>
          <GradeBadge grade={indicator.grade} fallbackColor={indicator.color} />
        </li>
      ))}
    </ul>
  );
}
