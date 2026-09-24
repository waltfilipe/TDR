"use client";

import { useEffect, useMemo, useState } from "react";

type ImprovementsPanelProps = {
  playerId: number;
  defaults: string[];
  min: number;
  max: number;
};

function normalize(items: string[], min: number, max: number): string[] {
  const next = items.slice(0, max);
  while (next.length < min) next.push("");
  return next;
}

export function ImprovementsPanel({ playerId, defaults, min, max }: ImprovementsPanelProps) {
  const storageKey = `idp:improvements:${playerId}`;
  const initial = useMemo(() => normalize(defaults, min, max), [defaults, min, max]);

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
        }
      }
    } catch {
      // Ignora storage indisponível (modo privado / cookies bloqueados).
    }
    setLoaded(true);
  }, [storageKey, min, max]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Sem persistência: a edição continua válida na sessão atual.
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

  const resetItems = () => setItems(normalize(defaults, min, max));

  return (
    <section className="panel" aria-labelledby="improve-title">
      <header className="panel__head">
        <div>
          <h2 id="improve-title" className="panel__title">
            Need to Improve
          </h2>
          <p className="panel__hint">
            {filled.length} de {items.length} preenchidos · {min} a {max} pontos por relatório
          </p>
        </div>
        <div className="panel__actions">
          {editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={resetItems}>
                Restaurar
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setEditing(false)}>
                Concluir
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
              Editar
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
                  placeholder={`Ponto de desenvolvimento ${index + 1}`}
                  onChange={(event) => updateItem(index, event.target.value)}
                  aria-label={`Item ${index + 1}`}
                />
                <button
                  type="button"
                  className="btn btn--icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= min}
                  aria-label={`Remover item ${index + 1}`}
                  title={items.length <= min ? `Mínimo de ${min} itens` : "Remover item"}
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
            {items.length >= max ? `Máximo de ${max} itens` : "Adicionar item"}
          </button>
          <p className="improve-editor__note">As alterações ficam salvas neste navegador.</p>
        </div>
      ) : (
        <ol className="improve-list">
          {items.map((item, index) => (
            <li key={index} className={`improve-row${item.trim() ? "" : " improve-row--empty"}`}>
              <span className="improve-row__index">{index + 1}</span>
              <span className="improve-row__text">{item.trim() || "A definir"}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
