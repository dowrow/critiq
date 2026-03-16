"use client";

import { CritiqueResult } from "@/lib/openai";
import { useLang } from "@/context/LangContext";
import { gradeBadge } from "@/lib/i18n";
import styles from "./Results.module.css";

interface ResultsProps {
  result: CritiqueResult;
}

function gradeColorClass(nota: number): string {
  if (nota >= 8) return styles.gradeExcellent;
  if (nota >= 6) return styles.gradeGood;
  if (nota >= 4) return styles.gradeAverage;
  return styles.gradePoor;
}

function scoreBarFillClass(score: number): string {
  if (score >= 8) return styles.scoreFillExcellent;
  if (score >= 6) return styles.scoreFillGood;
  if (score >= 4) return styles.scoreFillAverage;
  return styles.scoreFillPoor;
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 10) * 100);

  return (
    <div className={styles.scoreBar}>
      <div className={styles.scoreBarTrack}>
        <div
          className={`${styles.scoreBarFill} ${scoreBarFillClass(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.scoreValue}>{score.toFixed(1)}</span>
    </div>
  );
}

export default function Results({ result }: ResultsProps) {
  const { t } = useLang();
  const nota = result.nota_final;
  const colorClass = gradeColorClass(nota);

  return (
    <div className={styles.results}>
      {/* Title + Grade */}
      <div className={styles.gradeSection}>
        {result.titulo &&
          result.titulo !== "Sin título" &&
          result.titulo !== "Untitled" && (
            <h2 className={styles.title}>&ldquo;{result.titulo}&rdquo;</h2>
          )}
        <div className={`${styles.grade} ${colorClass}`}>
          {nota.toFixed(1)}
        </div>
        <div className={`${styles.gradeBadge} ${colorClass}`}>
          {gradeBadge(nota, t)}
        </div>
        <p className={styles.gradeLabel}>{t.gradeLabel}</p>
      </div>

      {/* Category scores */}
      <div className={styles.breakdown}>
        <h3 className={styles.sectionTitle}>{t.breakdownTitle}</h3>
        <div className={styles.categories}>
          {result.categorias.map((cat) => (
            <div key={cat.nombre}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{cat.nombre}</span>
                <span className={styles.categoryWeight}>{cat.peso}%</span>
              </div>
              <ScoreBar score={cat.puntuacion} />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback bullets */}
      <div>
        <h3 className={styles.sectionTitle}>{t.feedbackTitle}</h3>
        <ul className={styles.feedbackList}>
          {result.feedback.map((item, idx) => (
            <li key={idx} className={styles.feedbackItem}>
              <span className={styles.feedbackNumber}>{idx + 1}</span>
              <p className={styles.feedbackText}>{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Synthesis */}
      <div className={styles.synthesis}>
        <h3 className={styles.synthesisTitle}>{t.synthesisTitle}</h3>
        <p className={styles.synthesisText}>{result.sintesis}</p>
      </div>
    </div>
  );
}
