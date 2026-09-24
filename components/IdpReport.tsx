import { GradeLegend } from "@/components/GradeLegend";
import { ImprovementsPanel } from "@/components/ImprovementsPanel";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import type { IdpReport as IdpReportData } from "@/lib/report";

type IdpReportProps = {
  report: IdpReportData;
};

const CURRENT_SEASON_YEAR = 2026;

export function IdpReport({ report }: IdpReportProps) {
  const { player, technicalGrades, playerSpecificIndicators, improvements, meta } = report;
  const age = player.birth ? CURRENT_SEASON_YEAR - player.birth : null;

  const metaItems = [
    { label: "Posição", value: player.position },
    { label: "Clube", value: player.club },
    { label: "Nascimento", value: player.birth ? String(player.birth) : null },
    { label: "Idade", value: age ? `${age} anos` : null },
    { label: "Altura", value: player.height ? `${player.height} cm` : null },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark">SGA</span>
          <span className="brand__text">Performance</span>
        </div>
        <p className="topbar__title">Individual Development Plan</p>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero__identity">
            <p className="hero__eyebrow">Relatório individual</p>
            <h1 className="hero__name">{player.name}</h1>
            <dl className="hero__meta">
              {metaItems.map((item) => (
                <div key={item.label} className="hero__meta-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {(player.instagram || player.transfermarkt) && (
            <div className="hero__links">
              {player.transfermarkt && (
                <a className="btn btn--ghost" href={player.transfermarkt} target="_blank" rel="noreferrer">
                  Transfermarkt
                </a>
              )}
              {player.instagram && (
                <a className="btn btn--ghost" href={player.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="technical-title">
          <header className="panel__head">
            <div>
              <h2 id="technical-title" className="panel__title">
                Performance Indicators
              </h2>
              <p className="panel__hint">Avaliação técnica por fundamento</p>
            </div>
            <GradeLegend />
          </header>
          <IndicatorGrid
            indicators={technicalGrades.map((entry) => ({
              key: entry.field,
              label: entry.field,
              grade: entry.grade,
              color: entry.color,
            }))}
          />
        </section>

        <section className="panel" aria-labelledby="psi-title">
          <header className="panel__head">
            <div>
              <h2 id="psi-title" className="panel__title">
                Player-Specific Indicators
              </h2>
              <p className="panel__hint">Indicadores definidos para o atleta</p>
            </div>
          </header>
          <IndicatorGrid
            indicators={playerSpecificIndicators.map((entry) => ({
              key: entry.field,
              label: entry.label || entry.field,
              grade: entry.grade,
              color: entry.color,
            }))}
            emptyMessage="Nenhum indicador específico cadastrado para este atleta."
          />
        </section>

        <ImprovementsPanel
          playerId={player.id}
          defaults={improvements}
          min={meta.improvementLimits.min}
          max={meta.improvementLimits.max}
        />
      </main>

      <footer className="footer">
        Fonte: {meta.source} · SGA Performance
      </footer>
    </div>
  );
}
