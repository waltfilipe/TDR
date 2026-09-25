"use client";

import { useEffect, useMemo, useState } from "react";

type ImprovementsPanelProps = {
  playerId: number;
  min: number;
  max: number;
};

function normalize(items: string[], min: number, max: number): string[] {
  const next = items.slice(0, max);
  while (next.length < min) next.push("");
  return next;
}

export function ImprovementsPanel({ playerId, min, max }: ImprovementsPanelProps) {
  const storageKey = `idp:improvements:${playerId}`;
  const initial = useMemo(() => normalize([], min, max), [min, max]);

  const [items, setItems] = useState<string[]>(initial);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setItems(normalize(parsed, min, max));
          setLoaded(true);
          return;
        }
      }
    } catch {
      // localStorage unavailable
    }
    setItems(normalize([], min, max));
    setLoaded(true);
  }, [storageKey, min, max]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // persistence unavailable for this session
    }
  }, [items, loaded, storageKey]);

  const filled = items.filter((item) => item.trim().length > 0);

  const updateItem = (index: number, value: string) => {
    setItems((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => {
    setItems((current) => (current.length >= max ? current : [...current, ""]));
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length <= min ? current : current.filter((_, i) => i !== index)));
  };

  const resetItems = () => setItems(normalize([], min, max));

  return (
    <section className="panel" aria-labelledby="improve-title">
      <header className="panel__head">
        <div>
          <h2 id="improve-title" className="panel__title">
            Need to Improve
          </h2>
          <p className="panel__hint">
            {filled.length} of {items.length} filled · {min} to {max} items per report
          </p>
        </div>
        <div className="panel__actions">
          {editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={resetItems}>
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

      {editing ? (
        <div className="improve-editor">
          <ol className="improve-list improve-list--edit">
            {items.map((item, index) => (
              <li key={index} className="improve-row">
                <span className="improve-row__index">{index + 1}</span>
                <input
                  className="improve-row__input"
                  value={item}
                  maxLength={120}
                  placeholder={`Development focus ${index + 1}`}
                  onChange={(event) => updateItem(index, event.target.value)}
                  aria-label={`Item ${index + 1}`}
                />
                <button
                  type="button"
                  className="btn btn--icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= min}
                  aria-label={`Remove item ${index + 1}`}
                  title={items.length <= min ? `Minimum of ${min} items` : "Remove item"}
                >
                  ×
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn btn--dashed"
            onClick={addItem}
            disabled={items.length >= max}
          >
            {items.length >= max ? `Maximum of ${max} items` : "Add item"}
          </button>
          <p className="improve-editor__note">Changes are saved in this browser.</p>
        </div>
      ) : (
        <ol className="improve-list">
          {items.map((item, index) => (
            <li key={index} className={`improve-row${item.trim() ? "" : " improve-row--empty"}`}>
              <span className="improve-row__index">{index + 1}</span>
              <span className="improve-row__text">{item.trim() || "To be defined"}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
