import report from "@/data/report.json";

export type GradeName = "Below Level" | "Average" | "Good" | "Above Level";

export type GradeEntry = {
  field: string;
  grade: string;
  color: string;
};

export type PsiEntry = GradeEntry & {
  label: string;
};

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
  "Below Level": { color: "#e2555f", short: "Below" },
  Average: { color: "#e79038", short: "Average" },
  Good: { color: "#2fb765", short: "Good" },
  "Above Level": { color: "#297cc1", short: "Above" },
};

export function gradeLevel(grade: string): number {
  const index = GRADE_SCALE.indexOf(grade as GradeName);
  return index < 0 ? 0 : index + 1;
}

export function gradeColor(grade: string, fallback: string): string {
  return GRADE_TOKENS[grade as GradeName]?.color ?? fallback;
}

export function getReport(): IdpReport {
  return report as IdpReport;
}
