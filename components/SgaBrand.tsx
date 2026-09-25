import Image from "next/image";

const LOGO_HORIZONTAL = "/brand/sga-logo-horizontal.png";

export function SgaBrand() {
  return (
    <div className="sga-brand">
      <Image
        src={LOGO_HORIZONTAL}
        alt="SGA Performance"
        width={168}
        height={40}
        className="sga-brand__logo"
        priority
      />
    </div>
  );
}
