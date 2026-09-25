import { AthleteProfileColumn } from "@/components/AthleteProfileColumn";
import { GradeLegend } from "@/components/GradeLegend";
import { ImprovementsPanel } from "@/components/ImprovementsPanel";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import { SgaBrand } from "@/components/SgaBrand";
import { SgaLogo } from "@/components/SgaLogo";
import { BRAND } from "@/lib/brand";
import type { IdpReport as IdpReportData } from "@/lib/report";

type IdpReportProps = {
  report: IdpReportData;
};

const CURRENT_SEASON_YEAR = 2026;

export function IdpReport({ report }: IdpReportProps) {
  const { player, technicalGrades, playerSpecificIndicators, improvements, meta } = report;
  const age = player.birth ? CURRENT_SEASON_YEAR - player.birth : null;

  return (
    <div className="page-frame">
      <aside className="brand-rail" aria-label="Marca SGA">
        <SgaLogo variant="vertical" size="sidebar" />
        <p className="brand-rail__label">{BRAND.name}</p>
      </aside>

      <div className="shell">
      <header className="report-header">
        <div className="report-header__brand-block">
          <SgaBrand />
          <p className="report-header__tagline">{BRAND.legal}</p>
        </div>
        <div className="report-header__intro">
          <p className="report-header__eyebrow">Relatório oficial · {BRAND.name}</p>
          <h1 className="report-header__title">Training Development Report</h1>
        </div>
      </header>

      <main className="report-grid">
        <AthleteProfileColumn player={player} age={age} />

        <div className="report-stack">
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
        </div>
      </main>

      <footer className="site-footer">
        <SgaLogo variant="horizontal" size="sm" />
        <div className="site-footer__copy">
          <strong>{BRAND.name}</strong>
          <span>
            Fonte: {meta.source} · {BRAND.legal}
          </span>
        </div>
      </footer>
      </div>
    </div>
  );
}
