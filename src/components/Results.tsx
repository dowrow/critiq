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
  const grade = result.finalGrade;
  const colorClass = gradeColorClass(grade);

  return (
    <div className={styles.results}>
      {/* Title + Grade */}
      <div className={styles.gradeSection}>
        {result.title &&
          result.title !== "Sin título" &&
          result.title !== "Untitled" && (
            <h2 className={styles.title}>&ldquo;{result.title}&rdquo;</h2>
          )}
        <div className={`${styles.grade} ${colorClass}`}>
          {grade.toFixed(1)}
        </div>
        <div className={`${styles.gradeBadge} ${colorClass}`}>
          {gradeBadge(grade, t)}
        </div>
        <p className={styles.gradeLabel}>{t.gradeLabel}</p>
      </div>

      {/* Category scores */}
      <div className={styles.breakdown}>
        <h3 className={styles.sectionTitle}>{t.breakdownTitle}</h3>
        <div className={styles.categories}>
          {result.categories.map((cat) => (
            <div key={cat.name}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryWeight}>{cat.weight}%</span>
              </div>
              <ScoreBar score={cat.score} />
            </div>
          ))}
        </div>
      </div>

      {/* Best aspects */}
      <div className={styles.feedbackBest} aria-label={t.feedbackBestTitle}>
        <h3 className={styles.sectionTitle}>{t.feedbackBestTitle}</h3>
        <ul className={styles.feedbackList}>
          {result.best.map((item, idx) => (
            <li key={idx} className={styles.feedbackItem}>
              <span className={styles.feedbackIcon} aria-hidden="true">✅</span>
              <p className={styles.feedbackText}>{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Possible improvements */}
      <div className={styles.feedbackWorst} aria-label={t.feedbackWorstTitle}>
        <h3 className={styles.sectionTitle}>{t.feedbackWorstTitle}</h3>
        <ul className={styles.feedbackList}>
          {result.worst.map((item, idx) => (
            <li key={idx} className={styles.feedbackItem}>
              <span className={styles.feedbackIcon} aria-hidden="true">❌</span>
              <p className={styles.feedbackText}>{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Synthesis */}
      <div className={styles.synthesis}>
        <h3 className={styles.synthesisTitle}>{t.synthesisTitle}</h3>
        <p className={styles.synthesisText}>{result.synthesis}</p>
      </div>
    </div>
  );
}
