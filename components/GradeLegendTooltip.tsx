"use client";

import { useId, useState } from "react";
import { GRADE_SCALE, GRADE_TOKENS } from "@/lib/report";

export function GradeLegendTooltip() {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className="legend-tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="legend-tip__trigger"
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        aria-label="Show grade scale legend"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        Grade key
      </button>
      <div
        id={tooltipId}
        role="tooltip"
        className={`legend-tip__pop${open ? " is-visible" : ""}`}
      >
        <p className="legend-tip__title">Grade scale</p>
        <ul className="legend legend--stack">
          {GRADE_SCALE.map((grade) => (
            <li key={grade} className="legend__item">
              <span
                className="legend__dot"
                style={{ backgroundColor: GRADE_TOKENS[grade].color }}
              />
              {grade}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
