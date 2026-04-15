export type Lang = "es" | "en";

export const translations = {
  es: {
    // Header
    tagline: "Crítica literaria por IA · Relato breve",

    // Hero
    heroTitle1: "Evalúa tu relato",
    heroTitle2: "con IA",
    heroSubtitle:
      "Sube tu relato (PDF, DOCX o TXT, máximo 100 páginas) o pega un enlace a un artículo de Substack o documento de Google Docs y recibe una evaluación detallada con nota y hasta 10 recomendaciones accionables para mejorar tu escritura.",

    // Rubric
    rubricTitle: "Rúbrica de evaluación",
    rubricCategories: [
      { name: "Estructura narrativa", weight: "10%" },
      { name: "Voz narrativa y punto de vista", weight: "10%" },
      { name: "Personajes", weight: "10%" },
      { name: "Conflicto y tensión", weight: "10%" },
      { name: "Estilo y lenguaje", weight: "10%" },
      { name: "Escena y descripción", weight: "10%" },
      { name: "Tema e intención", weight: "10%" },
      { name: "Diálogo", weight: "10%" },
      { name: "Economía narrativa", weight: "10%" },
      { name: "Originalidad y riesgo", weight: "10%" },
    ],

    // Upload form
    dropzoneLabel: "Área de carga de archivos",
    fileSelectorLabel: "Selector de archivo",
    dropzonePrompt: "Arrastra tu relato aquí",
    dropzoneHint: "PDF, DOCX, DOC, TXT · Máximo 100 páginas · 50 MB",
    dropzoneChange: "Haz clic para cambiar",
    selectFile: "Seleccionar archivo",
    submitButton: "Evaluar relato",
    evaluating: "Evaluando tu relato…",
    noFileError: "Por favor, selecciona un archivo primero.",
    networkError: "Error de red. Verifica tu conexión e inténtalo de nuevo.",
    unknownError: "Error desconocido al evaluar el relato.",
    unsupportedFormat: (ext: string) =>
      `Formato no admitido: ${ext}. Usa PDF, DOCX, DOC o TXT.`,
    fileTooLarge: "El archivo supera el límite de 50 MB.",
    orDivider: "o",
    urlPlaceholder: "https://docs.google.com/document/d/... o Substack",
    urlLabel: "Enlace a artículo de Substack o documento de Google Docs",
    evaluateUrl: "Evaluar",
    invalidUrl: "La URL proporcionada no es válida.",

    // Results
    gradeLabel: "Nota sobre 10",
    gradeBadges: ["Necesita trabajo", "Aprobado", "Suficiente", "Bien", "Notable", "Excelente"],
    breakdownTitle: "Desglose por categorías",
    feedbackBestTitle: "Lo mejor",
    feedbackWorstTitle: "Posibles mejoras",
    synthesisTitle: "Síntesis",
    untitledStory: "Sin título",
    backButton: "← Evaluar otro relato",

    // Footer
    footer: "Evaluación literaria por IA · Powered by GPT-4o",
  },

  en: {
    // Header
    tagline: "AI literary critique · Short fiction",

    // Hero
    heroTitle1: "Evaluate your story",
    heroTitle2: "with AI",
    heroSubtitle:
      "Upload your story (PDF, DOCX or TXT, up to 100 pages) or paste a Substack article link or Google Docs document link and receive a detailed evaluation with a grade and up to 10 actionable recommendations to improve your writing.",

    // Rubric
    rubricTitle: "Evaluation rubric",
    rubricCategories: [
      { name: "Narrative structure", weight: "10%" },
      { name: "Narrative voice & point of view", weight: "10%" },
      { name: "Characters", weight: "10%" },
      { name: "Conflict & tension", weight: "10%" },
      { name: "Style & language", weight: "10%" },
      { name: "Scene & description", weight: "10%" },
      { name: "Theme & intent", weight: "10%" },
      { name: "Dialogue", weight: "10%" },
      { name: "Narrative economy", weight: "10%" },
      { name: "Originality & risk", weight: "10%" },
    ],

    // Upload form
    dropzoneLabel: "File upload area",
    fileSelectorLabel: "File selector",
    dropzonePrompt: "Drag your story here",
    dropzoneHint: "PDF, DOCX, DOC, TXT · Up to 100 pages · 50 MB",
    dropzoneChange: "Click to change",
    selectFile: "Select file",
    submitButton: "Evaluate story",
    evaluating: "Evaluating your story…",
    noFileError: "Please select a file first.",
    networkError: "Network error. Check your connection and try again.",
    unknownError: "Unknown error while evaluating the story.",
    unsupportedFormat: (ext: string) =>
      `Unsupported format: ${ext}. Use PDF, DOCX, DOC or TXT.`,
    fileTooLarge: "File exceeds the 50 MB limit.",
    orDivider: "or",
    urlPlaceholder: "https://docs.google.com/document/d/... or Substack",
    urlLabel: "Substack article or Google Docs document link",
    evaluateUrl: "Evaluate",
    invalidUrl: "The provided URL is not valid.",

    // Results
    gradeLabel: "Grade out of 10",
    gradeBadges: ["Needs work", "Pass", "Adequate", "Good", "Very good", "Excellent"],
    breakdownTitle: "Category breakdown",
    feedbackBestTitle: "The best",
    feedbackWorstTitle: "Possible improvements",
    synthesisTitle: "Summary",
    untitledStory: "Untitled",
    backButton: "← Evaluate another story",

    // Footer
    footer: "AI literary evaluation · Powered by GPT-4o",
  },
} as const;

export type Translations = (typeof translations)[Lang];

export function gradeBadge(grade: number, t: Translations): string {
  if (grade >= 9) return t.gradeBadges[5];
  if (grade >= 8) return t.gradeBadges[4];
  if (grade >= 7) return t.gradeBadges[3];
  if (grade >= 6) return t.gradeBadges[2];
  if (grade >= 5) return t.gradeBadges[1];
  return t.gradeBadges[0];
}
