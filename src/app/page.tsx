"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Results from "@/components/Results";
import { CritiqueResult } from "@/lib/openai";

export default function Home() {
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  function handleResult(data: unknown) {
    setResult(data as CritiqueResult | null);
  }

  function handleReset() {
    setResult(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            <span className="font-bold text-xl text-stone-800">critiq</span>
          </div>
          <span className="text-xs text-stone-400 hidden sm:block">
            Crítica literaria por IA · Relato breve
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {!result ? (
          <div className="flex flex-col gap-8">
            {/* Hero */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 mb-4">
                Evalúa tu relato
                <br />
                <span className="text-amber-600">con IA</span>
              </h1>
              <p className="text-stone-500 text-lg max-w-xl mx-auto">
                Sube tu relato (PDF, DOCX o TXT, máximo 100 páginas) y recibe
                una evaluación detallada con nota y hasta 10 recomendaciones
                accionables para mejorar tu escritura.
              </p>
            </div>

            {/* Rubric preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wider">
                Rúbrica de evaluación
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  { name: "Estructura narrativa", weight: "12%" },
                  { name: "Voz narrativa y punto de vista", weight: "12%" },
                  { name: "Personajes", weight: "12%" },
                  { name: "Conflicto y tensión", weight: "12%" },
                  { name: "Estilo y lenguaje", weight: "12%" },
                  { name: "Escena y descripción", weight: "10%" },
                  { name: "Tema e intención", weight: "10%" },
                  { name: "Diálogo", weight: "8%" },
                  { name: "Economía narrativa", weight: "7%" },
                  { name: "Originalidad y riesgo", weight: "5%" },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-stone-50"
                  >
                    <span className="text-stone-600">{cat.name}</span>
                    <span className="text-amber-600 font-semibold">
                      {cat.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload form */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <UploadForm
                onResult={handleResult}
                onError={setError}
                onLoading={setIsLoading}
                isLoading={isLoading}
              />
              {error && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
              <Results result={result} />
            </div>
            <button
              onClick={handleReset}
              className="mx-auto flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors text-sm font-medium"
            >
              ← Evaluar otro relato
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-stone-400">
        critiq · Evaluación literaria por IA · Powered by GPT-4o
      </footer>
    </div>
  );
}
