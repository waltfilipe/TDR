import type { IdpReport } from "@/lib/report";

type AthleteProfileColumnProps = {
  player: IdpReport["player"];
};

const PLACEHOLDER = "—";

function display(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return PLACEHOLDER;
  if (typeof value === "number" && value <= 0) return PLACEHOLDER;
  const text = String(value).trim();
  return text || PLACEHOLDER;
}

function displayName(name: string): string {
  const text = name.trim();
  return text || "Athlete Name";
}

export function AthleteProfileColumn({ player }: AthleteProfileColumnProps) {
  const age =
    player.birth && player.birth > 0 ? `${2026 - player.birth} anos` : PLACEHOLDER;

  const metaItems = [
    { label: "Posição", value: display(player.position) },
    { label: "Clube", value: display(player.club) },
    { label: "Nascimento", value: display(player.birth) },
    { label: "Idade", value: age },
    { label: "Altura", value: player.height && player.height > 0 ? `${player.height} cm` : PLACEHOLDER },
  ];

  return (
    <aside className="athlete-column" aria-label="Perfil do atleta">
      <div className="athlete-photo">
        <div className="athlete-photo__placeholder athlete-photo__placeholder--generic" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="athlete-photo__icon" focusable="false">
            <circle cx="32" cy="22" r="12" fill="currentColor" opacity="0.35" />
            <path
              d="M12 58c4-14 16-22 20-22s16 8 20 22"
              fill="currentColor"
              opacity="0.25"
            />
          </svg>
        </div>
      </div>

      <div className="athlete-details">
        <p className="athlete-details__label">Atleta</p>
        <h2 className="athlete-details__name">{displayName(player.name)}</h2>

        <dl className="athlete-details__meta">
          {metaItems.map((item) => (
            <div key={item.label} className="athlete-details__row">
              <dt>{item.label}</dt>
              <dd className={item.value === PLACEHOLDER ? "is-placeholder" : undefined}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
