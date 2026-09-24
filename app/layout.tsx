import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGA — Individual Development Plan",
  description: "Relatório IDP exportado do Power BI (Modelo - IDP v2).",
};

export const viewport = {
  themeColor: "#061426",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
