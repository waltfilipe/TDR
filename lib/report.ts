import report from "@/data/report.json";

export type GradeEntry = {
  field: string;
  grade: string;
  color: string;
};

export type RadarPoint = {
  label: string;
  value: number;
};

export type IdpReport = {
  meta: {
    source: string;
    page: string;
    canvas: { width: number; height: number };
    gradeColors: Record<string, string>;
  };
  player: {
    id: number;
    name: string;
    position: string;
    birth: number;
    height: number;
    club: string;
    photo: string;
    instagram: string | null;
    transfermarkt: string | null;
  };
  technicalGrades: GradeEntry[];
  mentalGrades: GradeEntry[];
  playerSpecificIndicators: {
    labels: Record<string, string>;
    grades: GradeEntry[];
  };
  strengths: string[];
  improvements: string[];
  studyReferences: string[];
  radar: RadarPoint[];
  momentsOfGame: {
    offensiveOrganization: number;
    offensiveTransition: number;
    defensiveOrganization: number;
    defensiveTransition: number;
    deadBall: number;
  } | null;
};

export function getReport(): IdpReport {
  return report as IdpReport;
}
