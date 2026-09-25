"use client";

import { useEffect, useState } from "react";
import { SgaLogo } from "@/components/SgaLogo";

/** Logo fixo à direita com leve movimento vertical conforme o scroll. */
export function SgaScrollBrand() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const amplitude = 72;
      const next = Math.sin(y * 0.006) * amplitude;
      setOffsetY(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        update();
        frame = 0;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside
      className="scroll-brand"
      aria-hidden="true"
      style={{ transform: `translateY(calc(-50% + ${offsetY}px))` }}
    >
      <SgaLogo variant="vertical" size="float" />
    </aside>
  );
}
