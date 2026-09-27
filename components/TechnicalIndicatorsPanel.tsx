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

function displayLabel(defaultName: string, labels: Record<string, string>): string {
  return labels[defaultName]?.trim() || defaultName;
}

export function TechnicalIndicatorsPanel({ playerId, defaults }: TechnicalIndicatorsPanelProps) {
  const gradesKey = `idp:technical-grades:${playerId}`;
  const labelsKey = `idp:technical-labels:${playerId}`;
  const ordered = useMemo(() => orderTechnicalGrades(defaults), [defaults]);
  const fallbackByField = useMemo(() => gradesMap(ordered), [ordered]);
  const colorByField = useMemo(
    () => Object.fromEntries(ordered.map((entry) => [entry.field, entry.color])),
    [ordered],
  );

  const [grades, setGrades] = useState<Record<string, string>>(fallbackByField);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedGrades = window.localStorage.getItem(gradesKey);
      const storedLabels = window.localStorage.getItem(labelsKey);
      let nextGrades = fallbackByField;
      let nextLabels: Record<string, string> = {};

      if (storedGrades) {
        const parsed = JSON.parse(storedGrades) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          nextGrades = { ...fallbackByField, ...parsed };
        }
      }
      if (storedLabels) {
        const parsed = JSON.parse(storedLabels) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          nextLabels = parsed;
        }
      }

      setGrades(nextGrades);
      setLabels(nextLabels);
      setLoaded(true);
    } catch {
      setGrades(fallbackByField);
      setLabels({});
      setLoaded(true);
    }
  }, [gradesKey, labelsKey, fallbackByField]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(gradesKey, JSON.stringify(grades));
      window.localStorage.setItem(labelsKey, JSON.stringify(labels));
    } catch {
      // ignore
    }
  }, [grades, labels, loaded, gradesKey, labelsKey]);

  const setGrade = (field: string, grade: string) => {
    setGrades((current) => ({ ...current, [field]: grade }));
  };

  const setLabel = (field: string, label: string) => {
    setLabels((current) => ({ ...current, [field]: label }));
  };

  const resetAll = () => {
    setGrades(fallbackByField);
    setLabels({});
  };

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
            {editing
              ? "Edit names and grades below — changes save in this browser."
              : "View indicators or use Edit to update names and grades."}
          </p>
        </div>
        <div className="panel__actions no-print">
          {editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={resetAll}>
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
          const label = displayLabel(entry.field, labels);
          const accent = grade ? gradeColor(grade, entry.color) : undefined;
          const fallbackColor = colorByField[entry.field] ?? entry.color;

          return (
            <li
              key={entry.field}
              className="indicator"
              style={accent ? { ["--indicator-color" as string]: accent } : undefined}
            >
              {editing ? (
                <input
                  className="indicator__label-input"
                  value={labels[entry.field] ?? ""}
                  maxLength={80}
                  placeholder={entry.field}
                  aria-label={`Name for ${entry.field}`}
                  onChange={(event) => setLabel(entry.field, event.target.value)}
                />
              ) : (
                <span className="indicator__label">{label}</span>
              )}
              <div className="indicator__grade-row">
                {editing ? (
                  <select
                    className="indicator__select"
                    value={grade}
                    aria-label={`Grade for ${label}`}
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
