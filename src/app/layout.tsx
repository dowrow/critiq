import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "critiq — Crítica literaria por IA",
  description:
    "Evalúa tu relato breve con inteligencia artificial. Nota detallada y feedback accionable basado en una rúbrica literaria profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
