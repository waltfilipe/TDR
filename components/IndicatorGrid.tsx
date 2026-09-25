import { GradeBadge } from "@/components/GradeBadge";

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
};

export function IndicatorGrid({ indicators, emptyMessage, columns = 2 }: IndicatorGridProps) {
  if (indicators.length === 0) {
    return <p className="empty-note">{emptyMessage ?? "No indicators on file."}</p>;
  }

  const colClass = columns === 4 ? " indicator-grid--4" : columns === 3 ? " indicator-grid--3" : columns === 2 ? " indicator-grid--2" : "";

  return (
    <ul
      className={`indicator-grid${colClass}`}
      style={colClass ? undefined : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {indicators.map((indicator) => (
        <li key={indicator.key} className="indicator">
          <span className="indicator__label">{indicator.label}</span>
          <GradeBadge grade={indicator.grade} fallbackColor={indicator.color} />
        </li>
      ))}
    </ul>
  );
}
