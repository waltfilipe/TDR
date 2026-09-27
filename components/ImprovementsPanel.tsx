"use client";

import { useEffect, useMemo, useState } from "react";
import { isValidHttpUrl, normalizeHttpUrl } from "@/lib/urls";

export type ImproveItem = {
  text: string;
  link: string;
};

type ImprovementsPanelProps = {
  playerId: number;
  min: number;
  max: number;
};

function emptyItems(min: number): ImproveItem[] {
  return Array.from({ length: min }, () => ({ text: "", link: "" }));
}

function normalize(items: ImproveItem[], min: number, max: number): ImproveItem[] {
  const next = items.slice(0, max).map((item) => ({
    text: item.text ?? "",
    link: item.link ?? "",
  }));
  while (next.length < min) next.push({ text: "", link: "" });
  return next;
}

function normalizeStoredRows(rows: unknown[], min: number, max: number): ImproveItem[] {
  const mapped = rows.map((row) => {
    if (typeof row === "string") {
      return { text: row, link: "" };
    }
    const item = row as Partial<ImproveItem>;
    return {
      text: typeof item.text === "string" ? item.text : "",
      link: typeof item.link === "string" ? item.link : "",
    };
  });
  return normalize(mapped, min, max);
}

export function ImprovementsPanel({ playerId, min, max }: ImprovementsPanelProps) {
  const storageKey = `idp:improvements:${playerId}`;
  const initial = useMemo(() => emptyItems(min), [min]);

  const [items, setItems] = useState<ImproveItem[]>(initial);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(normalizeStoredRows(parsed, min, max));
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
      // persistence unavailable for this session
    }
  }, [items, loaded, storageKey]);

  const filled = items.filter((item) => item.text.trim() || item.link.trim());

  const updateItem = (index: number, patch: Partial<ImproveItem>) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((current) => (current.length >= max ? current : [...current, { text: "", link: "" }]));
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length <= min ? current : current.filter((_, i) => i !== index)));
  };

  const resetItems = () => setItems(emptyItems(min));

  return (
    <section className="panel" aria-labelledby="improve-title">
      <header className="panel__head">
        <div>
          <h2 id="improve-title" className="panel__title">
            Need to Improve
          </h2>
          <p className="panel__hint">
            {filled.length} of {items.length} filled · {min} to {max} items · link per row
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
              <li key={index} className="improve-row improve-row--stack">
                <div className="improve-row__main">
                  <span className="improve-row__index">{index + 1}</span>
                  <input
                    className="improve-row__input"
                    value={item.text}
                    maxLength={120}
                    placeholder={`Development focus ${index + 1}`}
                    onChange={(event) => updateItem(index, { text: event.target.value })}
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
                </div>
                <input
                  className="improve-row__link-input"
                  value={item.link}
                  type="url"
                  inputMode="url"
                  placeholder="Google Drive or resource link (https://…)"
                  onChange={(event) => updateItem(index, { link: event.target.value })}
                  aria-label={`Link for item ${index + 1}`}
                />
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
        <ol className="improve-list improve-list--read">
          {items.map((item, index) => {
            const url = normalizeHttpUrl(item.link);
            const hasLink = isValidHttpUrl(url);
            const isEmpty = !item.text.trim() && !hasLink;

            return (
              <li key={index} className={`improve-row improve-row--read${isEmpty ? " improve-row--empty" : ""}`}>
                <span className="improve-row__index">{index + 1}</span>
                <span className="improve-row__text">{item.text.trim() || "To be defined"}</span>
                {hasLink ? (
                  <a
                    className="btn btn--ghost btn--compact improve-row__open"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open link
                  </a>
                ) : (
                  <span className="improve-row__link-missing">No link</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
