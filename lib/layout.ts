/** Positions from Power BI page "Duplicata de Duplicata de Capa" (1280×720). */

export const CANVAS = { width: 1280, height: 720 } as const;

export const BACKGROUND = "/pbix-assets/Modelo_-_IDP_v2_(23)8804807793744334.png";

export type Box = { x: number; y: number; w: number; h: number };

export const layout = {
  photo: { x: 24, y: 118, w: 220, h: 98 },
  position: { x: 26, y: 226, w: 224, h: 77 },
  club: { x: 26, y: 290, w: 224, h: 76 },
  radar: { x: 4, y: 396, w: 398, h: 324 },
  technicalGrades: [
    { x: 520, y: 165.5, w: 113, h: 33, pill: { x: 536, y: 164.4, w: 80, h: 33 } },
    { x: 725, y: 166, w: 113, h: 32, pill: { x: 741, y: 164, w: 80, h: 33 } },
    { x: 930, y: 167, w: 112, h: 31, pill: { x: 946, y: 164, w: 80, h: 33 } },
    { x: 1135, y: 166, w: 113, h: 33, pill: { x: 1151, y: 164, w: 80, h: 33 } },
    { x: 519, y: 212, w: 114, h: 32, pill: { x: 536, y: 209, w: 80, h: 33 } },
    { x: 725, y: 211, w: 112, h: 33, pill: { x: 741, y: 209, w: 80, h: 33 } },
    { x: 931, y: 212, w: 112, h: 32, pill: { x: 946, y: 210, w: 80, h: 33 } },
    { x: 1135, y: 212, w: 112, h: 32, pill: { x: 1151, y: 209, w: 80, h: 33 } },
  ] satisfies Array<Box & { pill: Box }>,
  psiLabels: [
    { x: 426, y: 302, w: 120, h: 77 },
    { x: 627, y: 302, w: 123, h: 77 },
    { x: 827, y: 303, w: 120, h: 77 },
    { x: 1027, y: 303, w: 126, h: 77 },
  ] satisfies Box[],
  psiGrades: [
    { x: 519, y: 327, w: 114, h: 31, pill: { x: 537, y: 326, w: 77, h: 30 } },
    { x: 725, y: 326, w: 113, h: 32, pill: { x: 743, y: 326, w: 78, h: 30 } },
    { x: 931, y: 327, w: 112, h: 32, pill: { x: 947, y: 327, w: 78, h: 30 } },
    { x: 1135, y: 327, w: 112, h: 32, pill: { x: 1152, y: 327, w: 78, h: 30 } },
  ] satisfies Array<Box & { pill: Box }>,
  mentalGrades: [
    { x: 520, y: 434, w: 113, h: 33, pill: { x: 536, y: 432, w: 80, h: 33 } },
    { x: 725, y: 435, w: 113, h: 31, pill: { x: 741, y: 432, w: 80, h: 33 } },
    { x: 930, y: 435, w: 112, h: 31, pill: { x: 946, y: 433, w: 80, h: 33 } },
  ] satisfies Array<Box & { pill: Box }>,
  strengths: [
    { x: 432, y: 526, w: 384, h: 76 },
    { x: 432, y: 574, w: 384, h: 76 },
    { x: 432, y: 623, w: 384, h: 77 },
  ] satisfies Box[],
  improvements: [
    { x: 866, y: 526, w: 385, h: 76 },
    { x: 866, y: 575, w: 385, h: 74 },
    { x: 866, y: 623, w: 385, h: 76 },
  ] satisfies Box[],
} as const;

export const PSI_KEYS = ["1st PSI", "2nd PSI", "3rd PSI", "4th PSI"] as const;
