"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fileToCompressedDataUrl } from "@/lib/image";
import type { IdpReport } from "@/lib/report";

type AthleteProfileColumnProps = {
  playerId: number;
  player: IdpReport["player"];
};

type AthleteDraft = {
  name: string;
  position: string;
  club: string;
  birthYear: string;
  heightCm: string;
  photoDataUrl: string | null;
};

const PLACEHOLDER = "—";

function emptyDraft(player: IdpReport["player"]): AthleteDraft {
  return {
    name: player.name?.trim() || "",
    position: player.position?.trim() || "",
    club: player.club?.trim() || "",
    birthYear: player.birth && player.birth > 0 ? String(player.birth) : "",
    heightCm: player.height && player.height > 0 ? String(player.height) : "",
    photoDataUrl: player.photo?.trim() || null,
  };
}

function displayField(value: string): string {
  return value.trim() || PLACEHOLDER;
}

function displayName(name: string): string {
  return name.trim() || "Athlete Name";
}

export function AthleteProfileColumn({ playerId, player }: AthleteProfileColumnProps) {
  const storageKey = `idp:athlete:${playerId}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initial = useMemo(() => emptyDraft(player), [player]);

  const [draft, setDraft] = useState<AthleteDraft>(initial);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AthleteDraft>;
        setDraft({
          name: typeof parsed.name === "string" ? parsed.name : initial.name,
          position: typeof parsed.position === "string" ? parsed.position : initial.position,
          club: typeof parsed.club === "string" ? parsed.club : initial.club,
          birthYear: typeof parsed.birthYear === "string" ? parsed.birthYear : initial.birthYear,
          heightCm: typeof parsed.heightCm === "string" ? parsed.heightCm : initial.heightCm,
          photoDataUrl:
            typeof parsed.photoDataUrl === "string" || parsed.photoDataUrl === null
              ? parsed.photoDataUrl
              : initial.photoDataUrl,
        });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [storageKey, initial]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // quota exceeded — photo may be too large
    }
  }, [draft, loaded, storageKey]);

  const update = (patch: Partial<AthleteDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const displayPhoto = pendingPhoto ?? draft.photoDataUrl;
  const hasSavedPhoto = Boolean(draft.photoDataUrl);
  const isPhotoPending = pendingPhoto !== null;

  const onPhotoSelected = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPendingPhoto(dataUrl);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Could not load photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const savePhoto = () => {
    if (!pendingPhoto) return;
    update({ photoDataUrl: pendingPhoto });
    setPendingPhoto(null);
    setPhotoError(null);
  };

  const cancelPhoto = () => {
    setPendingPhoto(null);
    setPhotoError(null);
  };

  const removePhoto = () => {
    setPendingPhoto(null);
    update({ photoDataUrl: null });
    setPhotoError(null);
  };

  const resetProfile = () => {
    setDraft(emptyDraft(player));
    setPendingPhoto(null);
    setPhotoError(null);
  };

  const metaRead = [
    { label: "Position", value: displayField(draft.position) },
    { label: "Club", value: displayField(draft.club) },
    { label: "Birth year", value: displayField(draft.birthYear) },
    {
      label: "Height",
      value: draft.heightCm.trim() ? `${draft.heightCm.trim()} cm` : PLACEHOLDER,
    },
  ];

  return (
    <aside className="athlete-column" aria-label="Athlete profile">
      <div className="athlete-photo-block">
        <div className={`athlete-photo${isPhotoPending ? " athlete-photo--pending" : ""}`}>
          {displayPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayPhoto} alt="" className="athlete-photo__img" />
          ) : (
            <div className="athlete-photo__placeholder athlete-photo__placeholder--generic" aria-hidden="true">
              <svg viewBox="0 0 64 64" className="athlete-photo__icon" focusable="false">
                <circle cx="32" cy="22" r="12" fill="currentColor" opacity="0.35" />
                <path d="M12 58c4-14 16-22 20-22s16 8 20 22" fill="currentColor" opacity="0.25" />
              </svg>
            </div>
          )}
          {isPhotoPending ? <span className="athlete-photo__badge no-print">Preview</span> : null}
        </div>

        <div className="athlete-photo__toolbar no-print">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              void onPhotoSelected(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          {isPhotoPending ? (
            <div className="athlete-photo__toolbar-row">
              <button type="button" className="btn btn--primary btn--block" onClick={savePhoto}>
                Save photo
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={cancelPhoto}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="athlete-photo__toolbar-row">
              <button
                type="button"
                className="btn btn--ghost btn--block"
                disabled={photoBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                {photoBusy ? "Processing…" : hasSavedPhoto ? "Change photo" : "Upload photo"}
              </button>
              {hasSavedPhoto ? (
                <button type="button" className="btn btn--ghost btn--block" onClick={removePhoto}>
                  Remove photo
                </button>
              ) : null}
            </div>
          )}

          {photoError ? <p className="athlete-photo__error">{photoError}</p> : null}
          {isPhotoPending ? (
            <p className="athlete-photo__hint">Confirm with Save photo or discard with Cancel.</p>
          ) : null}
        </div>
      </div>

      <div className="athlete-details">
        <div className="athlete-details__head">
          <p className="athlete-details__label">Athlete</p>
          <div className="panel__actions no-print">
            {editing ? (
              <>
                <button type="button" className="btn btn--ghost" onClick={resetProfile}>
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
        </div>

        {editing ? (
          <>
            <div className="athlete-form no-print">
              <label className="athlete-form__field">
                <span>Name</span>
                <input
                  value={draft.name}
                  maxLength={80}
                  onChange={(event) => update({ name: event.target.value })}
                />
              </label>
              <label className="athlete-form__field">
                <span>Position</span>
                <input
                  value={draft.position}
                  maxLength={40}
                  onChange={(event) => update({ position: event.target.value })}
                />
              </label>
              <label className="athlete-form__field">
                <span>Club</span>
                <input value={draft.club} maxLength={80} onChange={(event) => update({ club: event.target.value })} />
              </label>
              <label className="athlete-form__field">
                <span>Birth year</span>
                <input
                  inputMode="numeric"
                  value={draft.birthYear}
                  maxLength={4}
                  placeholder="e.g. 2010"
                  onChange={(event) => update({ birthYear: event.target.value.replace(/\D/g, "").slice(0, 4) })}
                />
              </label>
              <label className="athlete-form__field">
                <span>Height (cm)</span>
                <input
                  inputMode="numeric"
                  value={draft.heightCm}
                  maxLength={3}
                  placeholder="e.g. 175"
                  onChange={(event) => update({ heightCm: event.target.value.replace(/\D/g, "").slice(0, 3) })}
                />
              </label>
            </div>
            <div className="print-only">
              <h2 className="athlete-details__name">{displayName(draft.name)}</h2>
              <dl className="athlete-details__meta">
                {metaRead.map((item) => (
                  <div key={item.label} className="athlete-details__row">
                    <dt>{item.label}</dt>
                    <dd className={item.value === PLACEHOLDER ? "is-placeholder" : undefined}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        ) : (
          <>
            <h2 className="athlete-details__name">{displayName(draft.name)}</h2>
            <dl className="athlete-details__meta">
              {metaRead.map((item) => (
                <div key={item.label} className="athlete-details__row">
                  <dt>{item.label}</dt>
                  <dd className={item.value === PLACEHOLDER ? "is-placeholder" : undefined}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </aside>
  );
}
