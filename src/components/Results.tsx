import { CritiqueResult } from "@/lib/openai";
import { useLang } from "@/context/LangContext";
import { gradeBadge } from "@/lib/i18n";

interface ResultsProps {
  result: CritiqueResult;
}

function gradeColor(nota: number): string {
  if (nota >= 8) return "text-emerald-600";
  if (nota >= 6) return "text-amber-600";
  if (nota >= 4) return "text-orange-600";
  return "text-red-600";
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 10) * 100);
  const color =
    score >= 8
      ? "bg-emerald-500"
      : score >= 6
      ? "bg-amber-500"
      : score >= 4
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-stone-700 w-8 text-right">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export default function Results({ result }: ResultsProps) {
  const { t } = useLang();
  const nota = result.nota_final;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Title + Grade */}
      <div className="text-center">
        {result.titulo && result.titulo !== "Sin título" && result.titulo !== "Untitled" && (
          <h2 className="text-2xl font-bold text-stone-800 mb-4 italic">
            &ldquo;{result.titulo}&rdquo;
          </h2>
        )}
        <div className={`text-8xl font-black tabular-nums ${gradeColor(nota)}`}>
          {nota.toFixed(1)}
        </div>
        <div
          className={`mt-2 text-xl font-semibold tracking-wide ${gradeColor(nota)}`}
        >
          {gradeBadge(nota, t)}
        </div>
        <p className="text-stone-500 text-sm mt-1">{t.gradeLabel}</p>
      </div>

      {/* Category scores */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
        <h3 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wider">
          {t.breakdownTitle}
        </h3>
        <div className="flex flex-col gap-3">
          {result.categorias.map((cat) => (
            <div key={cat.nombre}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600 font-medium">{cat.nombre}</span>
                <span className="text-stone-400">{cat.peso}%</span>
              </div>
              <ScoreBar score={cat.puntuacion} />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback bullets */}
      <div>
        <h3 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wider">
          {t.feedbackTitle}
        </h3>
        <ul className="flex flex-col gap-3">
          {result.feedback.map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <p className="text-stone-700 text-sm leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Synthesis */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-800 mb-3 text-sm uppercase tracking-wider">
          {t.synthesisTitle}
        </h3>
        <p className="text-stone-700 leading-relaxed">{result.sintesis}</p>
      </div>
    </div>
  );
}
