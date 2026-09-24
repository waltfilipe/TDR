import Image from "next/image";
import { GradePill } from "@/components/GradePill";
import { RadarMoG } from "@/components/RadarMoG";
import { ScaleCanvas } from "@/components/ScaleCanvas";
import { BACKGROUND, PSI_KEYS, layout } from "@/lib/layout";
import type { IdpReport } from "@/lib/report";

type IdpCapaPageProps = {
  report: IdpReport;
};

function OverlayText({
  box,
  text,
  className,
}: {
  box: { x: number; y: number; w: number; h: number };
  text: string;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div
      className={`overlay-text ${className ?? ""}`.trim()}
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
      }}
    >
      {text}
    </div>
  );
}

export function IdpCapaPage({ report }: IdpCapaPageProps) {
  const { player, technicalGrades, mentalGrades, playerSpecificIndicators, strengths, improvements, radar } =
    report;

  return (
    <main className="idp-page">
      <ScaleCanvas>
        <div className="idp-canvas">
          <Image
            src={BACKGROUND}
            alt=""
            fill
            priority
            className="idp-background"
            sizes="1280px"
          />

          <div className="idp-photo" style={{ left: layout.photo.x, top: layout.photo.y, width: layout.photo.w, height: layout.photo.h }}>
            {player.photo ? (
              <Image src={player.photo} alt={player.name} fill className="idp-photo-img" sizes="220px" />
            ) : null}
          </div>

          <OverlayText box={layout.position} text={player.position ?? ""} className="profile-value" />
          <OverlayText box={layout.club} text={player.club ?? ""} className="profile-value" />

          <div className="idp-radar" style={{ left: layout.radar.x, top: layout.radar.y, width: layout.radar.w, height: layout.radar.h }}>
            <RadarMoG points={radar} width={layout.radar.w} height={layout.radar.h} />
          </div>

          {technicalGrades.map((entry, index) => {
            const slot = layout.technicalGrades[index];
            if (!slot) return null;
            return <GradePill key={entry.field} box={slot.pill} grade={entry.grade} color={entry.color} />;
          })}

          {PSI_KEYS.map((key, index) => (
            <OverlayText
              key={key}
              box={layout.psiLabels[index]}
              text={playerSpecificIndicators.labels[key] ?? ""}
              className="psi-label"
            />
          ))}

          {playerSpecificIndicators.grades.map((entry, index) => {
            const slot = layout.psiGrades[index];
            if (!slot) return null;
            return <GradePill key={entry.field} box={slot.pill} grade={entry.grade} color={entry.color} />;
          })}

          {mentalGrades.map((entry, index) => {
            const slot = layout.mentalGrades[index];
            if (!slot) return null;
            return <GradePill key={entry.field} box={slot.pill} grade={entry.grade} color={entry.color} />;
          })}

          {strengths.map((text, index) => (
            <OverlayText key={`s-${index}`} box={layout.strengths[index]} text={text} className="list-item" />
          ))}

          {improvements.map((text, index) => (
            <OverlayText key={`i-${index}`} box={layout.improvements[index]} text={text} className="list-item" />
          ))}
        </div>
      </ScaleCanvas>
    </main>
  );
}
