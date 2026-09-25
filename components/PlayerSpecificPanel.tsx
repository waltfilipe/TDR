"use client";

import { useEffect, useMemo, useState } from "react";
import { GRADE_SCALE } from "@/lib/report";

export type PsiItem = {
  label: string;
  grade: string;
};

type PlayerSpecificPanelProps = {
  playerId: number;
  min: number;
  max: number;
};

function emptyItems(min: number): PsiItem[] {
  return Array.from({ length: min }, () => ({ label: "", grade: "" }));
}

function normalize(items: PsiItem[], min: number, max: number): PsiItem[] {
  const next = items.slice(0, max).map((item) => ({
    label: item.label ?? "",
    grade: item.grade ?? "",
  }));
  while (next.length < min) next.push({ label: "", grade: "" });
  return next;
}

export function PlayerSpecificPanel({ playerId, min, max }: PlayerSpecificPanelProps) {
  const storageKey = `idp:player-specific:${playerId}`;
  const initial = useMemo(() => emptyItems(min), [min]);

  const [items, setItems] = useState<PsiItem[]>(initial);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(normalize(parsed, min, max));
          setLoaded(true);
          return;
        }
      }
    } catch {
      // localStorage unavailable
    }
    setItems(normalize(emptyItems(min), min, max));
    setLoaded(true);
  }, [storageKey, min, max]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, loaded, storageKey]);

  const filled = items.filter((item) => item.label.trim() || item.grade.trim());

  const updateItem = (index: number, patch: Partial<PsiItem>) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((current) => (current.length >= max ? current : [...current, { label: "", grade: "" }]));
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length <= min ? current : current.filter((_, i) => i !== index)));
  };

  const resetItems = () => setItems(emptyItems(min));

  return (
    <section className="panel" aria-labelledby="psi-title">
      <header className="panel__head">
        <div>
          <h2 id="psi-title" className="panel__title">
            Player-Specific Indicators
          </h2>
          <p className="panel__hint">
            {filled.length} of {items.length} filled · {min} to {max} indicators
          </p>
        </div>
        <div className="panel__actions">
          {editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={resetItems}>
                Clear
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

      {editing ? (
        <div className="psi-editor">
          <ol className="psi-list psi-list--edit">
            {items.map((item, index) => (
              <li key={index} className="psi-row">
                <span className="psi-row__index">{index + 1}</span>
                <input
                  className="psi-row__input"
                  value={item.label}
                  maxLength={80}
                  placeholder={`Indicator ${index + 1}`}
                  onChange={(event) => updateItem(index, { label: event.target.value })}
                  aria-label={`Indicator name ${index + 1}`}
                />
                <select
                  className="psi-row__select"
                  value={item.grade}
                  onChange={(event) => updateItem(index, { grade: event.target.value })}
                  aria-label={`Indicator grade ${index + 1}`}
                >
                  <option value="">Ungraded</option>
                  {GRADE_SCALE.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn--icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= min}
                  aria-label={`Remove indicator ${index + 1}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn--dashed" onClick={addItem} disabled={items.length >= max}>
            {items.length >= max ? `Maximum of ${max} indicators` : "Add indicator"}
          </button>
          <p className="improve-editor__note">Changes are saved in this browser.</p>
        </div>
      ) : (
        <ol className="psi-list psi-list--read">
          {items.map((item, index) => (
            <li key={index} className={`psi-row psi-row--read${item.label.trim() || item.grade ? "" : " psi-row--empty"}`}>
              <span className="psi-row__index">{index + 1}</span>
              <span className="psi-row__label">{item.label.trim() || "To be defined"}</span>
              <span className="psi-row__grade">{item.grade.trim() || "—"}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
