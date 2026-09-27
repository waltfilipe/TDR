"use client";

import { useEffect, useState } from "react";

type ReportActionsBarProps = {
  playerId: number;
};

function normalizeDriveUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ReportActionsBar({ playerId }: ReportActionsBarProps) {
  const storageKey = `idp:drive-link:${playerId}`;
  const [input, setInput] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (typeof stored === "string") {
        setInput(stored);
        setSavedUrl(stored);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, savedUrl);
    } catch {
      // ignore
    }
  }, [savedUrl, loaded, storageKey]);

  const saveLink = () => {
    setMessage(null);
    const normalized = normalizeDriveUrl(input);
    if (!normalized) {
      setSavedUrl("");
      setMessage("Link cleared.");
      return;
    }
    if (!isValidHttpUrl(normalized)) {
      setMessage("Enter a valid link (https://…).");
      return;
    }
    setSavedUrl(normalized);
    setInput(normalized);
    setMessage("Google Drive link saved.");
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <section className="panel report-actions no-print" aria-labelledby="report-actions-title">
      <header className="panel__head panel__head--compact">
        <div>
          <h2 id="report-actions-title" className="panel__title">
            Report actions
          </h2>
          <p className="panel__hint">Attach a Google Drive folder or file, then export a PDF copy.</p>
        </div>
      </header>

      <div className="report-actions__grid">
        <div className="report-actions__drive">
          <label className="report-actions__label" htmlFor="drive-link-input">
            Google Drive link
          </label>
          <div className="report-actions__row">
            <input
              id="drive-link-input"
              className="report-actions__input"
              type="url"
              inputMode="url"
              placeholder="https://drive.google.com/…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="button" className="btn btn--primary" onClick={saveLink}>
              Save link
            </button>
            <a
              className={`btn btn--ghost${savedUrl ? "" : " is-disabled"}`}
              href={savedUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!savedUrl}
              onClick={(event) => {
                if (!savedUrl) event.preventDefault();
              }}
            >
              Open Drive
            </a>
          </div>
          {message ? <p className="report-actions__note">{message}</p> : null}
        </div>

        <div className="report-actions__export">
          <p className="report-actions__label">Export</p>
          <button type="button" className="btn btn--primary btn--block" onClick={exportPdf}>
            Export report to PDF
          </button>
          <p className="report-actions__note">Uses your browser print dialog — choose “Save as PDF”.</p>
        </div>
      </div>
    </section>
  );
}
