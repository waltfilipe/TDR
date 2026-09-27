import { AthleteProfileColumn } from "@/components/AthleteProfileColumn";
import { ImprovementsPanel } from "@/components/ImprovementsPanel";
import { PlayerSpecificPanel } from "@/components/PlayerSpecificPanel";
import { ReportActionsBar } from "@/components/ReportActionsBar";
import { SgaBrand } from "@/components/SgaBrand";
import { SgaCornerBrand } from "@/components/SgaCornerBrand";
import { TechnicalIndicatorsPanel } from "@/components/TechnicalIndicatorsPanel";
import { BRAND } from "@/lib/brand";
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
          <AthleteProfileColumn playerId={player.id} player={player} />

          <div className="report-stack">
            <TechnicalIndicatorsPanel playerId={player.id} defaults={technicalGrades} />

            <PlayerSpecificPanel playerId={player.id} min={min} max={max} />

            <ImprovementsPanel playerId={player.id} min={min} max={max} />

            <ReportActionsBar playerId={player.id} report={report} />
          </div>
        </main>

        <footer className="footer">
          <p className="footer__slogan">{BRAND.slogan}</p>
          <p className="footer__rights">All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
