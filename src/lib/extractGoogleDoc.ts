/**
 * Google Docs URL detection and plain-text extraction.
 *
 * Works with publicly shared documents ("anyone with the link can view").
 * Uses the /export?format=txt endpoint that Google Docs exposes for every
 * document, which returns the document contents as UTF-8 plain text.
 */

const GDOC_RE =
  /^https?:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/;

/**
 * Returns `true` when the URL looks like a Google Docs document link.
 *
 * Accepted formats:
 *  - https://docs.google.com/document/d/{id}/edit
 *  - https://docs.google.com/document/d/{id}/preview
 *  - https://docs.google.com/document/d/{id}
 *  - …any other path under the document id
 */
export function isGoogleDocUrl(url: string): boolean {
  return GDOC_RE.test(url);
}

/**
 * Extract the document ID from a Google Docs URL.
 * Returns `null` when the URL doesn't match.
 */
function extractDocId(url: string): string | null {
  const match = url.match(GDOC_RE);
  return match ? match[1] : null;
}

/**
 * Fetch a publicly-shared Google Docs document and return its plain text.
 */
export async function extractTextFromGoogleDoc(
  url: string,
): Promise<string> {
  const docId = extractDocId(url);
  if (!docId) {
    throw new Error(
      "La URL proporcionada no corresponde a un documento de Google Docs.",
    );
  }

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  const res = await fetch(exportUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; CritiqBot/1.0; +https://critiq.app)",
      Accept: "text/plain",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "No se encontró el documento de Google Docs. Verifica que la URL sea correcta.",
      );
    }
    if (res.status === 403 || res.status === 401) {
      throw new Error(
        "No se pudo acceder al documento de Google Docs. Asegúrate de que esté compartido como público (\"Cualquier persona con el enlace\").",
      );
    }
    throw new Error(
      `No se pudo acceder al documento de Google Docs (HTTP ${res.status}).`,
    );
  }

  const text = (await res.text()).trim();

  if (!text) {
    throw new Error(
      "El documento de Google Docs está vacío o no se pudo extraer texto de él.",
    );
  }

  return text;
}
