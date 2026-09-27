import type { CSSProperties } from "react";
import { BRAND, SGA_GRADE_COLORS } from "@/lib/brand";
import { gradeColor } from "@/lib/report";
import type { ReportSnapshot } from "@/lib/reportSnapshot";
import { isValidHttpUrl, normalizeHttpUrl } from "@/lib/urls";

type ReportPdfSheetProps = {
  snapshot: ReportSnapshot;
};

const PLACEHOLDER = "—";
const ROWS_PER_COLUMN = 2;

function text(value: string): string {
  return value.trim() || PLACEHOLDER;
}

function chipStyle(grade: string): CSSProperties {
  const color = gradeColor(grade, SGA_GRADE_COLORS.Average);
  return { color, borderColor: `${color}59`, backgroundColor: `${color}14` };
}

function linkLabel(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return "Open";
  }
}

function toColumns<T>(items: T[], rows: number): T[][] {
  const columns: T[][] = [];
  const total = Math.max(1, Math.ceil(items.length / rows));
  for (let column = 0; column < total; column += 1) {
    const slice = items.slice(column * rows, column * rows + rows);
    if (slice.length) columns.push(slice);
  }
  return columns;
}

export function ReportPdfSheet({ snapshot }: ReportPdfSheetProps) {
  const { athlete, technical, psi, improvements } = snapshot;
  const name = athlete.name.trim() || "Athlete Name";
  const issued = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const technicalColumns = toColumns(technical, ROWS_PER_COLUMN);

  const profileSpecs = [
    { label: "Position", value: text(athlete.position) },
    { label: "Club", value: text(athlete.club) },
    { label: "Birth year", value: text(athlete.birthYear) },
    { label: "Height", value: athlete.heightCm.trim() ? `${athlete.heightCm.trim()} cm` : PLACEHOLDER },
  ];

  return (
    <article className="pdf-sheet" aria-hidden="true">
      <header className="pdf-head" data-pdf-bleed="#072334">
        <div className="pdf-head__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logoTrimmed} alt="" className="pdf-head__logo" />
        </div>
        <div className="pdf-head__titles">
          <p className="pdf-head__eyebrow">{BRAND.legal}</p>
          <h1 className="pdf-head__title">Training Development Report</h1>
          <p className="pdf-head__issued">Issued {issued}</p>
        </div>
      </header>
      <div className="pdf-rule" data-pdf-bleed="#297cc1" />

      <div className="pdf-body">
        <section className="pdf-profile">
          {/* html2canvas ignores object-fit, so the crop is done with a background image. */}
          <div
            className={`pdf-profile__photo${athlete.photoDataUrl ? "" : " pdf-profile__photo--empty"}`}
            style={athlete.photoDataUrl ? { backgroundImage: `url(${athlete.photoDataUrl})` } : undefined}
          >
            {athlete.photoDataUrl ? null : <span>No photo</span>}
          </div>

          <div className="pdf-profile__info">
            <p className="pdf-profile__label">Athlete</p>
            <h2 className="pdf-profile__name">{name}</h2>
            <dl className="pdf-specs">
              {profileSpecs.map((spec) => (
                <div key={spec.label} className="pdf-specs__item">
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pdf-section">
          <div className="pdf-section__head">
            <h3>Technical Indicators</h3>
            <span className="pdf-section__rule" />
          </div>
          <div className="pdf-tech">
            {technicalColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="pdf-tech__col">
                {column.map((entry) => {
                  const accent = entry.grade ? gradeColor(entry.grade, SGA_GRADE_COLORS.Average) : "#d8e2ec";
                  return (
                    <div key={entry.field} className="pdf-tech__card" style={{ borderLeftColor: accent }}>
                      <span className="pdf-tech__label">{entry.label}</span>
                      {entry.grade ? (
                        <span className="pdf-chip" style={chipStyle(entry.grade)}>
                          <span className="pdf-chip__dot" style={{ backgroundColor: accent }} />
                          {entry.grade}
                        </span>
                      ) : (
                        <span className="pdf-chip pdf-chip--empty">Ungraded</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="pdf-section">
          <div className="pdf-section__head">
            <h3>Player-Specific Indicators</h3>
            <span className="pdf-section__rule" />
          </div>
          <div className="pdf-table">
            <div className="pdf-table__head">
              <span>#</span>
              <span>Indicator</span>
              <span>Grade</span>
              <span>Reference</span>
            </div>
            {psi.map((item, index) => {
              const url = normalizeHttpUrl(item.link);
              const hasLink = isValidHttpUrl(url);
              const label = item.label.trim();
              return (
                <div key={index} className="pdf-table__row">
                  <span className="pdf-index">{index + 1}</span>
                  <span className={`pdf-table__name${label ? "" : " is-empty"}`}>{label || "To be defined"}</span>
                  <span className="pdf-table__cell">
                    {item.grade.trim() ? (
                      <span className="pdf-chip" style={chipStyle(item.grade)}>
                        <span
                          className="pdf-chip__dot"
                          style={{ backgroundColor: gradeColor(item.grade, SGA_GRADE_COLORS.Average) }}
                        />
                        {item.grade}
                      </span>
                    ) : (
                      <span className="pdf-muted">{PLACEHOLDER}</span>
                    )}
                  </span>
                  <span className="pdf-table__cell">
                    {hasLink ? (
                      <span className="pdf-link" data-pdf-link={url}>
                        {linkLabel(url)}
                      </span>
                    ) : (
                      <span className="pdf-muted">{PLACEHOLDER}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pdf-section">
          <div className="pdf-section__head">
            <h3>Need to Improve</h3>
            <span className="pdf-section__rule" />
          </div>
          <div className="pdf-table pdf-table--improve">
            <div className="pdf-table__head">
              <span>#</span>
              <span>Focus</span>
              <span>Reference</span>
            </div>
            {improvements.map((item, index) => {
              const value = item.text.trim();
              const url = normalizeHttpUrl(item.link);
              const hasLink = isValidHttpUrl(url);
              return (
                <div key={index} className="pdf-table__row">
                  <span className="pdf-index">{index + 1}</span>
                  <span className={`pdf-table__name${value ? "" : " is-empty"}`}>{value || "To be defined"}</span>
                  <span className="pdf-table__cell pdf-table__cell--wide">
                    {hasLink ? (
                      <span className="pdf-link" data-pdf-link={url}>
                        {linkLabel(url)}
                      </span>
                    ) : (
                      <span className="pdf-muted">{PLACEHOLDER}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="pdf-rule" data-pdf-bleed="#297cc1" />
      <footer className="pdf-foot" data-pdf-bleed="#072334">
        <span className="pdf-foot__slogan">{BRAND.slogan}</span>
        <span className="pdf-foot__rights">All rights reserved · {BRAND.name}</span>
      </footer>
    </article>
  );
}
