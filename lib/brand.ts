export const BRAND = {
  name: "SGA Performance",
  legal: "Soccer Growth Analytics",
  logos: {
    horizontal: "/brand/sga-logo-horizontal.png",
    vertical: "/brand/sga-logo-vertical.png",
    symbol: "/brand/sga-logo-symbol.png",
  },
} as const;

export type LogoVariant = keyof typeof BRAND.logos;
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero" | "sidebar" | "float" | "corner";

export const LOGO_DIMENSIONS: Record<
  LogoVariant,
  { width: number; height: number; className: LogoSize }
> = {
  horizontal: { width: 240, height: 56, className: "lg" },
  vertical: { width: 128, height: 160, className: "sidebar" },
  symbol: { width: 56, height: 56, className: "md" },
};
