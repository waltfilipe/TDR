"use client";

import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ReportPdfSheet } from "@/components/ReportPdfSheet";
import { exportSheetToPdf } from "@/lib/exportPdf";
import { loadReportSnapshot } from "@/lib/reportSnapshot";
import type { IdpReport } from "@/lib/report";

type ReportActionsBarProps = {
  playerId: number;
  report: IdpReport;
};

export function ReportActionsBar({ playerId, report }: ReportActionsBarProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async () => {
    setError(null);
    setExporting(true);

    const host = document.createElement("div");
    host.className = "pdf-sheet-host";
    document.body.appendChild(host);

    const snapshot = loadReportSnapshot(playerId, report, report.meta.improvementLimits);
    const root = createRoot(host);

    try {
      root.render(<ReportPdfSheet snapshot={snapshot} />);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const sheet = host.querySelector(".pdf-sheet");
      if (!(sheet instanceof HTMLElement)) {
        throw new Error("Could not prepare the PDF layout.");
      }

      const safeName = (snapshot.athlete.name.trim() || "athlete")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      await exportSheetToPdf(sheet, `training-development-report-${safeName || "export"}.pdf`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "PDF export failed.");
    } finally {
      root.unmount();
      host.remove();
      setExporting(false);
    }
  };

  return (
    <section className="panel report-actions" aria-labelledby="report-actions-title">
      <header className="panel__head panel__head--compact">
        <div>
          <h2 id="report-actions-title" className="panel__title">
            Export
          </h2>
          <p className="panel__hint">
            Generates a clean PDF from your saved report data (not a screenshot of this screen).
          </p>
        </div>
      </header>

      <button type="button" className="btn btn--primary btn--block" disabled={exporting} onClick={() => void exportPdf()}>
        {exporting ? "Building PDF…" : "Export report to PDF"}
      </button>
      {error ? <p className="report-actions__note report-actions__note--error">{error}</p> : null}
    </section>
  );
}
