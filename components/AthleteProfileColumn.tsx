import Image from "next/image";
import type { IdpReport } from "@/lib/report";

type AthleteProfileColumnProps = {
  player: IdpReport["player"];
  age: number | null;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AthleteProfileColumn({ player, age }: AthleteProfileColumnProps) {
  const metaItems = [
    { label: "Posição", value: player.position },
    { label: "Clube", value: player.club },
    { label: "Nascimento", value: player.birth ? String(player.birth) : null },
    { label: "Idade", value: age ? `${age} anos` : null },
    { label: "Altura", value: player.height ? `${player.height} cm` : null },
  ].filter((item) => Boolean(item.value));

  const photo = player.photo?.trim();

  return (
    <aside className="athlete-column" aria-label="Perfil do atleta">
      <div className="athlete-photo">
        {photo ? (
          <Image
            src={photo}
            alt={`Foto de ${player.name}`}
            fill
            className="athlete-photo__img"
            sizes="(max-width: 900px) 100vw, 340px"
            priority
          />
        ) : (
          <div className="athlete-photo__placeholder" aria-hidden="true">
            {initials(player.name) || "—"}
          </div>
        )}
      </div>

      <div className="athlete-details">
        <p className="athlete-details__label">Atleta</p>
        <h2 className="athlete-details__name">{player.name}</h2>

        <dl className="athlete-details__meta">
          {metaItems.map((item) => (
            <div key={item.label} className="athlete-details__row">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
