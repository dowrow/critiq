"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Results from "@/components/Results";
import { CritiqueResult } from "@/lib/openai";
import { useLang } from "@/context/LangContext";
import styles from "./page.module.css";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className={styles.langToggle}>
      <button
        onClick={() => setLang("es")}
        className={`${styles.langBtn} ${lang === "es" ? styles.langBtnActive : ""}`}
        aria-pressed={lang === "es"}
      >
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`}
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
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoEmoji}>✍️</span>
            <span className={styles.logoText}>critiq</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.tagline}>{t.tagline}</span>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {!result ? (
          <div className={styles.uploadPage}>
            {/* Hero */}
            <div className={styles.hero}>
              <h1 className={styles.heroTitle}>
                {t.heroTitle1}
                <br />
                <span className={styles.heroAccent}>{t.heroTitle2}</span>
              </h1>
              <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
            </div>

            {/* Upload form */}
            <div className={styles.card}>
              <UploadForm
                onResult={handleResult}
                onError={setError}
                onLoading={setIsLoading}
                isLoading={isLoading}
              />
              {error && <div className={styles.errorBox}>{error}</div>}
            </div>

            {/* Rubric preview */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>{t.rubricTitle}</h2>
              <div className={styles.rubricGrid}>
                {t.rubricCategories.map((cat) => (
                  <div key={cat.name} className={styles.rubricItem}>
                    <span className={styles.rubricName}>{cat.name}</span>
                    <span className={styles.rubricWeight}>{cat.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.resultsPage}>
            <button onClick={handleReset} className={styles.backButton}>
              {t.backButton}
            </button>
            <div className={styles.resultCard}>
              <Results result={result} />
            </div>
            <button onClick={handleReset} className={styles.backButton}>
              {t.backButton}
            </button>
          </div>
        )}
      </main>

      <footer className={styles.footer}>critiq · {t.footer}</footer>
    </div>
  );
}
