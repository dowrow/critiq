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
  nombre: string;
  puntuacion: number;
  peso: number;
}

export interface CritiqueResult {
  titulo: string;
  nota_final: number;
  categorias: CategoryScore[];
  feedback: string[];
  sintesis: string;
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
    typeof result.nota_final !== "number" ||
    !Array.isArray(result.categorias) ||
    !Array.isArray(result.feedback) ||
    typeof result.sintesis !== "string"
  ) {
    throw new Error("La respuesta de la IA no tiene el formato esperado.");
  }

  // Cap feedback to 10 bullets
  result.feedback = result.feedback.slice(0, 10);

  return result;
}
