import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./rubric";

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "La variable de entorno OPENAI_API_KEY no está configurada."
    );
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export interface CategoryScore {
  name: string;
  score: number;
  weight: number;
}

export interface CritiqueResult {
  title: string;
  finalGrade: number;
  categories: CategoryScore[];
  best: string[];
  worst: string[];
  synthesis: string;
}

export async function evaluateStory(storyText: string): Promise<CritiqueResult> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Por favor, evalúa el siguiente relato:\n\n${storyText}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("La IA no devolvió ningún contenido.");
  }

  const result = JSON.parse(content) as CritiqueResult;

  // Validate required fields
  if (
    typeof result.finalGrade !== "number" ||
    !Array.isArray(result.categories) ||
    !Array.isArray(result.best) ||
    !Array.isArray(result.worst) ||
    typeof result.synthesis !== "string"
  ) {
    throw new Error("La respuesta de la IA no tiene el formato esperado.");
  }

  // Cap feedback blocks
  result.best = result.best.slice(0, 10);
  result.worst = result.worst.slice(0, 10);

  return result;
}
