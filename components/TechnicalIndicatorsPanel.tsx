"use client";

import { useEffect, useMemo, useState } from "react";
import { GradeLegendTooltip } from "@/components/GradeLegendTooltip";
import { GradeBadge } from "@/components/GradeBadge";
import {
  GRADE_SCALE,
  gradeColor,
  orderTechnicalGrades,
  type GradeEntry,
} from "@/lib/report";

type TechnicalIndicatorsPanelProps = {
  playerId: number;
  defaults: GradeEntry[];
};

function gradesMap(entries: GradeEntry[]): Record<string, string> {
  return Object.fromEntries(entries.map((entry) => [entry.field, entry.grade]));
}

export function TechnicalIndicatorsPanel({ playerId, defaults }: TechnicalIndicatorsPanelProps) {
  const storageKey = `idp:technical-grades:${playerId}`;
  const ordered = useMemo(() => orderTechnicalGrades(defaults), [defaults]);
  const fallbackByField = useMemo(() => gradesMap(ordered), [ordered]);
  const colorByField = useMemo(
    () => Object.fromEntries(ordered.map((entry) => [entry.field, entry.color])),
    [ordered],
  );

  const [grades, setGrades] = useState<Record<string, string>>(fallbackByField);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          setGrades({ ...fallbackByField, ...parsed });
          setLoaded(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    setGrades(fallbackByField);
    setLoaded(true);
  }, [storageKey, fallbackByField]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(grades));
    } catch {
      // ignore
    }
  }, [grades, loaded, storageKey]);

  const setGrade = (field: string, grade: string) => {
    setGrades((current) => ({ ...current, [field]: grade }));
  };

  const resetGrades = () => setGrades(fallbackByField);

  return (
    <section className="panel" aria-labelledby="technical-title">
      <header className="panel__head panel__head--compact">
        <div>
          <div className="panel__title-row">
            <h2 id="technical-title" className="panel__title">
              Technical Indicators
            </h2>
            <GradeLegendTooltip />
          </div>
          <p className="panel__hint">
            {editing ? "Edit grades below — changes save in this browser." : "View grades or use Edit to update."}
          </p>
        </div>
        <div className="panel__actions no-print">
          {editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={resetGrades}>
                Reset
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setEditing(false)}>
                Done
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </header>

      <ul className="indicator-grid indicator-grid--4 indicator-grid--pairs">
        {ordered.map((entry) => {
          const grade = grades[entry.field] ?? "";
          const accent = grade ? gradeColor(grade, entry.color) : undefined;
          const fallbackColor = colorByField[entry.field] ?? entry.color;

          return (
            <li
              key={entry.field}
              className="indicator"
              style={accent ? { ["--indicator-color" as string]: accent } : undefined}
            >
              <span className="indicator__label">{entry.field}</span>
              <div className="indicator__grade-row">
                {editing ? (
                  <select
                    className="indicator__select"
                    value={grade}
                    aria-label={`Grade for ${entry.field}`}
                    onChange={(event) => setGrade(entry.field, event.target.value)}
                  >
                    <option value="">Ungraded</option>
                    {GRADE_SCALE.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <GradeBadge grade={grade} fallbackColor={fallbackColor} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
