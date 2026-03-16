import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";

export const metadata: Metadata = {
  title: "critiq — AI literary critique / Crítica literaria por IA",
  description:
    "Evaluate your short story with AI. Detailed grade and actionable feedback based on a professional literary rubric. / Evalúa tu relato con IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
