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
};

export function IndicatorGrid({ indicators, emptyMessage }: IndicatorGridProps) {
  if (indicators.length === 0) {
    return <p className="empty-note">{emptyMessage ?? "Nenhum indicador cadastrado."}</p>;
  }

  return (
    <ul className="indicator-grid">
      {indicators.map((indicator) => (
        <li key={indicator.key} className="indicator">
          <span className="indicator__label">{indicator.label}</span>
          <GradeBadge grade={indicator.grade} fallbackColor={indicator.color} />
        </li>
      ))}
    </ul>
  );
}
