import "./polyfillDOMMatrix";
import fs from "fs";
import path from "path";

export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
  fileName: string
): Promise<string> {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".txt" || mimeType === "text/plain") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (ext === ".pdf" || mimeType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ url: filePath });
    const data = await parser.getText();
    return data.text;
  }

  if (
    ext === ".docx" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === ".doc" || mimeType === "application/msword") {
    const mammoth = await import("mammoth");
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(
    `Formato de archivo no compatible: ${ext}. Los formatos admitidos son PDF, DOCX, DOC y TXT.`
  );
}

/**
 * Estimates the number of pages based on character count.
 * Average page ~ 1800 characters (300 words × 6 chars/word).
 */
export function estimatePages(text: string): number {
  return Math.ceil(text.length / 1800);
}
