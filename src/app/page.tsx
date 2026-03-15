"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Results from "@/components/Results";
import { CritiqueResult } from "@/lib/openai";
import { useLang } from "@/context/LangContext";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang("es")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "es"
            ? "bg-amber-600 text-white shadow-sm"
            : "text-stone-400 hover:text-stone-700"
        }`}
        aria-pressed={lang === "es"}
      >
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-amber-600 text-white shadow-sm"
            : "text-stone-400 hover:text-stone-700"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 hidden sm:block">
              {t.tagline}
            </span>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {!result ? (
          <div className="flex flex-col gap-8">
            {/* Hero */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 mb-4">
                {t.heroTitle1}
                <br />
                <span className="text-amber-600">{t.heroTitle2}</span>
              </h1>
              <p className="text-stone-500 text-lg max-w-xl mx-auto">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Rubric preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wider">
                {t.rubricTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {t.rubricCategories.map((cat) => (
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
              {t.backButton}
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-stone-400">
        critiq · {t.footer}
      </footer>
    </div>
  );
}
