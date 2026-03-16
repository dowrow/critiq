import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, Files } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { extractTextFromFile, estimatePages } from "@/lib/extractText";
import { extractTextFromSubstack } from "@/lib/extractSubstack";
import { evaluateStory } from "@/lib/openai";

const MAX_PAGES = 100;

function nextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
  const readable = new Readable({
    read() {},
  });

  req.arrayBuffer().then((buffer) => {
    readable.push(Buffer.from(buffer));
    readable.push(null);
  });

  const msg = readable as unknown as IncomingMessage;
  msg.headers = Object.fromEntries(req.headers.entries());
  msg.method = req.method ?? "POST";
  msg.url = req.url ?? "";

  return msg;
}

/**
 * Extract story text from a Substack URL sent as JSON { url: "..." }.
 */
async function handleUrlRequest(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!url) {
    return NextResponse.json(
      { error: "No se ha proporcionado una URL." },
      { status: 400 }
    );
  }

  let storyText: string;
  try {
    storyText = await extractTextFromSubstack(url);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Error al extraer el texto del artículo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return evaluateText(storyText);
}

/**
 * Extract story text from a multipart file upload.
 */
async function handleFileRequest(req: NextRequest): Promise<NextResponse> {
  const incomingMsg = nextRequestToIncomingMessage(req);

  const form = new IncomingForm({
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    keepExtensions: true,
  });

  const { files } = await new Promise<{ files: Files }>(
    (resolve, reject) => {
      form.parse(incomingMsg, (err, _fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    }
  );

  const fileArray = files.file;
  if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
    return NextResponse.json(
      { error: "No se ha enviado ningún archivo." },
      { status: 400 }
    );
  }

  const uploadedFile = Array.isArray(fileArray) ? fileArray[0] : fileArray;
  const filePath = uploadedFile.filepath;
  const mimeType = uploadedFile.mimetype ?? "";
  const originalName = uploadedFile.originalFilename ?? "archivo";

  let storyText: string;
  try {
    storyText = await extractTextFromFile(filePath, mimeType, originalName);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error al leer el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return evaluateText(storyText);
}

/**
 * Common path: validate extracted text, check page limit, evaluate via OpenAI.
 */
async function evaluateText(rawText: string): Promise<NextResponse> {
  const storyText = rawText.trim();

  if (!storyText) {
    return NextResponse.json(
      { error: "El archivo está vacío o no se pudo extraer texto de él." },
      { status: 400 }
    );
  }

  const estimatedPages = estimatePages(storyText);
  if (estimatedPages > MAX_PAGES) {
    return NextResponse.json(
      {
        error: `El relato supera el límite de ${MAX_PAGES} páginas (se estiman ~${estimatedPages} páginas). Por favor, envía un texto más corto.`,
      },
      { status: 400 }
    );
  }

  const result = await evaluateStory(storyText);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "La variable de entorno OPENAI_API_KEY no está configurada. Por favor, añádela a tu archivo .env.local.",
        },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return await handleUrlRequest(req);
    }

    return await handleFileRequest(req);
  } catch (err: unknown) {
    console.error("Error en /api/evaluate:", err);
    const message =
      err instanceof Error ? err.message : "Error interno del servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
