import type { CSSProperties } from "react";
import { BRAND, SGA_GRADE_COLORS } from "@/lib/brand";
import { gradeColor } from "@/lib/report";
import type { ReportSnapshot } from "@/lib/reportSnapshot";
import { isValidHttpUrl, normalizeHttpUrl } from "@/lib/urls";

type ReportPdfSheetProps = {
  snapshot: ReportSnapshot;
};

const PLACEHOLDER = "—";

function text(value: string): string {
  return value.trim() || PLACEHOLDER;
}

function gradeStyle(grade: string): CSSProperties {
  const color = gradeColor(grade, SGA_GRADE_COLORS.Average);
  return {
    color,
    borderColor: color,
    backgroundColor: `${color}22`,
  };
}

export function ReportPdfSheet({ snapshot }: ReportPdfSheetProps) {
  const { athlete, technical, psi, improvements } = snapshot;
  const name = athlete.name.trim() || "Athlete Name";

  const technicalColumns: { field: string; grade: string }[][] = [];
  const rowCount = 2;
  const columnCount = Math.max(1, Math.ceil(technical.length / rowCount));
  for (let column = 0; column < columnCount; column += 1) {
    const col: { field: string; grade: string }[] = [];
    for (let row = 0; row < rowCount; row += 1) {
      const entry = technical[column * rowCount + row];
      if (entry) col.push(entry);
    }
    technicalColumns.push(col);
  }

  return (
    <article className="pdf-sheet" aria-hidden="true">
      <header className="pdf-sheet__header">
        <div>
          <p className="pdf-sheet__eyebrow">{BRAND.legal}</p>
          <h1 className="pdf-sheet__title">Training Development Report</h1>
        </div>
        <p className="pdf-sheet__brand">{BRAND.name}</p>
      </header>

      <section className="pdf-sheet__profile">
        <div className="pdf-sheet__photo">
          {athlete.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={athlete.photoDataUrl} alt="" />
          ) : (
            <div className="pdf-sheet__photo-placeholder" />
          )}
        </div>
        <div className="pdf-sheet__profile-meta">
          <h2>{name}</h2>
          <dl>
            <div>
              <dt>Position</dt>
              <dd>{text(athlete.position)}</dd>
            </div>
            <div>
              <dt>Club</dt>
              <dd>{text(athlete.club)}</dd>
            </div>
            <div>
              <dt>Birth year</dt>
              <dd>{text(athlete.birthYear)}</dd>
            </div>
            <div>
              <dt>Height</dt>
              <dd>{athlete.heightCm.trim() ? `${athlete.heightCm.trim()} cm` : PLACEHOLDER}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pdf-sheet__section">
        <h3>Technical Indicators</h3>
        <div className="pdf-sheet__tech-grid">
          {technicalColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="pdf-sheet__tech-col">
              {column.map((entry) => (
                <div key={entry.field} className="pdf-sheet__tech-card">
                  <span className="pdf-sheet__tech-label">{entry.field}</span>
                  {entry.grade ? (
                    <span className="pdf-sheet__grade" style={gradeStyle(entry.grade)}>
                      {entry.grade}
                    </span>
                  ) : (
                    <span className="pdf-sheet__grade pdf-sheet__grade--empty">Ungraded</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="pdf-sheet__section">
        <h3>Player-Specific Indicators</h3>
        <table className="pdf-sheet__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Indicator</th>
              <th>Grade</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {psi.map((item, index) => {
              const url = normalizeHttpUrl(item.link);
              const hasLink = isValidHttpUrl(url);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.label.trim() || "To be defined"}</td>
                  <td>{item.grade.trim() || PLACEHOLDER}</td>
                  <td className="pdf-sheet__link-cell">
                    {hasLink ? url : PLACEHOLDER}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="pdf-sheet__section">
        <h3>Need to Improve</h3>
        <ol className="pdf-sheet__list">
          {improvements.map((item, index) => (
            <li key={index}>{item.trim() || "To be defined"}</li>
          ))}
        </ol>
      </section>

      <footer className="pdf-sheet__footer">
        <p>{BRAND.slogan}</p>
        <p>All rights reserved.</p>
      </footer>
    </article>
  );
}
