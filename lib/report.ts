import report from "@/data/report.json";
import { SGA_GRADE_COLORS } from "@/lib/brand";

export type GradeName = "Below Level" | "Average" | "Good" | "Above Level";

export type GradeEntry = {
  field: string;
  grade: string;
  color: string;
};

export type PsiEntry = GradeEntry & {
  label: string;
};

/** Display order: fill columns top-to-bottom (4 columns × 2 rows). */
export const TECHNICAL_INDICATOR_ORDER = [
  "Link-Up Play (Lay-offs)",
  "Final Pass",
  "Ball Protection",
  "Finishing Touches",
  "Finishing",
  "Heading",
  "Pressing Triggers",
  "Defensive Positioning",
] as const;

export type IdpReport = {
  meta: {
    source: string;
    page: string;
    gradeColors: Record<string, string>;
    improvementLimits: { min: number; max: number };
  };
  player: {
    id: number;
    name: string;
    position: string;
    birth: number;
    height: number;
    club: string;
    photo: string | null;
  };
  technicalGrades: GradeEntry[];
  playerSpecificIndicators: PsiEntry[];
  improvements: string[];
};

/** Ordered weakest to strongest — drives the level meter and the legend. */
export const GRADE_SCALE: GradeName[] = ["Below Level", "Average", "Good", "Above Level"];

export const GRADE_TOKENS: Record<GradeName, { color: string; short: string }> = {
  "Below Level": { color: SGA_GRADE_COLORS["Below Level"], short: "Below" },
  Average: { color: SGA_GRADE_COLORS.Average, short: "Average" },
  Good: { color: SGA_GRADE_COLORS.Good, short: "Good" },
  "Above Level": { color: SGA_GRADE_COLORS["Above Level"], short: "Above" },
};

export function gradeLevel(grade: string): number {
  const index = GRADE_SCALE.indexOf(grade as GradeName);
  return index < 0 ? 0 : index + 1;
}

export function gradeColor(grade: string, fallback: string): string {
  return GRADE_TOKENS[grade as GradeName]?.color ?? fallback;
}

export function orderTechnicalGrades(grades: GradeEntry[]): GradeEntry[] {
  const byField = new Map(grades.map((entry) => [entry.field, entry]));
  const ordered: GradeEntry[] = [];

  for (const field of TECHNICAL_INDICATOR_ORDER) {
    const entry = byField.get(field);
    if (entry) ordered.push(entry);
  }

  for (const entry of grades) {
    if (!TECHNICAL_INDICATOR_ORDER.includes(entry.field as (typeof TECHNICAL_INDICATOR_ORDER)[number])) {
      ordered.push(entry);
    }
  }

  return ordered;
}

export function getReport(): IdpReport {
  return report as IdpReport;
}
