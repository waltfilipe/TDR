import type { ImproveItem } from "@/components/ImprovementsPanel";
import type { PsiItem } from "@/components/PlayerSpecificPanel";
import {
  orderTechnicalGrades,
  type GradeEntry,
  type IdpReport,
} from "@/lib/report";

export type StoredAthlete = {
  name: string;
  position: string;
  club: string;
  birthYear: string;
  heightCm: string;
  photoDataUrl: string | null;
};

export type ReportSnapshot = {
  athlete: StoredAthlete;
  technical: { field: string; label: string; grade: string }[];
  psi: PsiItem[];
  improvements: ImproveItem[];
};

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function defaultAthlete(player: IdpReport["player"]): StoredAthlete {
  return {
    name: player.name?.trim() || "",
    position: player.position?.trim() || "",
    club: player.club?.trim() || "",
    birthYear: player.birth && player.birth > 0 ? String(player.birth) : "",
    heightCm: player.height && player.height > 0 ? String(player.height) : "",
    photoDataUrl: player.photo?.trim() || null,
  };
}

function normalizePsi(items: unknown[], min: number, max: number): PsiItem[] {
  const next = items.slice(0, max).map((row) => {
    const item = row as Partial<PsiItem>;
    return {
      label: typeof item.label === "string" ? item.label : "",
      grade: typeof item.grade === "string" ? item.grade : "",
      link: typeof item.link === "string" ? item.link : "",
    };
  });
  while (next.length < min) next.push({ label: "", grade: "", link: "" });
  return next;
}

function normalizeImprove(items: unknown[], min: number, max: number): ImproveItem[] {
  const next = items.slice(0, max).map((row) => {
    if (typeof row === "string") {
      return { text: row, link: "" };
    }
    const item = row as Partial<ImproveItem>;
    return {
      text: typeof item.text === "string" ? item.text : "",
      link: typeof item.link === "string" ? item.link : "",
    };
  });
  while (next.length < min) next.push({ text: "", link: "" });
  return next;
}

export function loadReportSnapshot(
  playerId: number,
  report: IdpReport,
  limits: { min: number; max: number },
): ReportSnapshot {
  const ordered = orderTechnicalGrades(report.technicalGrades);
  const fallbackGrades = Object.fromEntries(ordered.map((entry) => [entry.field, entry.grade]));

  const storedAthlete = readJson<Partial<StoredAthlete>>(`idp:athlete:${playerId}`);
  const athlete: StoredAthlete = {
    ...defaultAthlete(report.player),
    ...(storedAthlete ?? {}),
  };

  const storedGrades = readJson<Record<string, string>>(`idp:technical-grades:${playerId}`);
  const storedLabels = readJson<Record<string, string>>(`idp:technical-labels:${playerId}`);
  const grades = { ...fallbackGrades, ...(storedGrades ?? {}) };
  const labels = storedLabels ?? {};

  const storedPsi = readJson<unknown[]>(`idp:player-specific:${playerId}`);
  const psi = storedPsi
    ? normalizePsi(storedPsi, limits.min, limits.max)
    : normalizePsi([], limits.min, limits.max);

  const storedImprove = readJson<unknown[]>(`idp:improvements:${playerId}`);
  const improvements = storedImprove
    ? normalizeImprove(storedImprove, limits.min, limits.max)
    : normalizeImprove([], limits.min, limits.max);

  return {
    athlete,
    technical: ordered.map((entry: GradeEntry) => ({
      field: entry.field,
      label: labels[entry.field]?.trim() || entry.field,
      grade: grades[entry.field] ?? "",
    })),
    psi,
    improvements,
  };
}
