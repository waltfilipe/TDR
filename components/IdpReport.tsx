import { AthleteProfileColumn } from "@/components/AthleteProfileColumn";
import { GradeLegendTooltip } from "@/components/GradeLegendTooltip";
import { ImprovementsPanel } from "@/components/ImprovementsPanel";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import { PlayerSpecificPanel } from "@/components/PlayerSpecificPanel";
import { SgaBrand } from "@/components/SgaBrand";
import { SgaCornerBrand } from "@/components/SgaCornerBrand";
import type { IdpReport as IdpReportData } from "@/lib/report";

type IdpReportProps = {
  report: IdpReportData;
};

export function IdpReport({ report }: IdpReportProps) {
  const { player, technicalGrades, meta } = report;
  const { min, max } = meta.improvementLimits;

  return (
    <>
      <SgaCornerBrand />

      <div className="shell">
        <header className="report-header">
          <SgaBrand />
          <div className="report-header__intro">
            <p className="report-header__eyebrow">Soccer Growth Analytics</p>
            <h1 className="report-header__title">Training Development Report</h1>
          </div>
        </header>

        <main className="report-grid">
          <AthleteProfileColumn player={player} />

          <div className="report-stack">
            <section className="panel" aria-labelledby="technical-title">
              <header className="panel__head panel__head--compact">
                <div>
                  <div className="panel__title-row">
                    <h2 id="technical-title" className="panel__title">
                      Technical Indicators
                    </h2>
                    <GradeLegendTooltip />
                  </div>
                  <p className="panel__hint">Technical assessment by skill category</p>
                </div>
              </header>
              <IndicatorGrid
                columns={4}
                indicators={technicalGrades.map((entry) => ({
                  key: entry.field,
                  label: entry.field,
                  grade: entry.grade,
                  color: entry.color,
                }))}
              />
            </section>

            <PlayerSpecificPanel playerId={player.id} min={min} max={max} />

            <ImprovementsPanel playerId={player.id} min={min} max={max} />
          </div>
        </main>

        <footer className="footer">
          Source: {meta.source} · SGA Performance
        </footer>
      </div>
    </>
  );
}
