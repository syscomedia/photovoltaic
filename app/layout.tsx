import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04070d",
};

export const metadata: Metadata = {
  title: "HELIA Énergie — Installations photovoltaïques en Tunisie",
  description:
    "Études, installation et maintenance de centrales solaires photovoltaïques : résidentiel, industriel, pompage agricole. Devis gratuit sous 24 h.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}<div className="grain" aria-hidden="true" /></body>
    </html>
  );
}
