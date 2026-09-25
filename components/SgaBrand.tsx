import { SgaLogo } from "@/components/SgaLogo";

/** Header brand lockup (horizontal logo). */
export function SgaBrand() {
  return (
    <div className="sga-brand">
      <SgaLogo variant="horizontal" size="xl" priority />
    </div>
  );
}
