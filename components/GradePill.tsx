import type { Box } from "@/lib/layout";

type GradePillProps = {
  box: Box;
  grade: string;
  color: string;
};

const SHORT_GRADE: Record<string, string> = {
  "Below Level": "Below Level",
  "Above Level": "Above Level",
  Average: "Average",
  Good: "Good",
};

export function GradePill({ box, grade, color }: GradePillProps) {
  if (!grade) return null;
  const label = SHORT_GRADE[grade] ?? grade;

  return (
    <div
      className="grade-pill"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        backgroundColor: color,
      }}
      title={grade}
    >
      <span>{label}</span>
    </div>
  );
}
