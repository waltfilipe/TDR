"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CANVAS } from "@/lib/layout";

type ScaleCanvasProps = {
  children: ReactNode;
  className?: string;
};

export function ScaleCanvas({ children, className }: ScaleCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      setScale(Math.min(width / CANVAS.width, 1));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className={`scale-host ${className ?? ""}`.trim()}
      style={{ height: CANVAS.height * scale }}
    >
      <div
        className="scale-stage"
        style={{
          width: CANVAS.width,
          height: CANVAS.height,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
