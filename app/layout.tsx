import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGA — Training Development Report",
  description: "Relatório de desenvolvimento do atleta — SGA Performance.",
};

export const viewport = {
  themeColor: "#072334",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/good-times-2" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
