import * as cheerio from "cheerio";

const SUBSTACK_HOST_RE = /^https?:\/\/([a-z0-9-]+\.)?substack\.com\//i;
const CUSTOM_SUBSTACK_PATH_RE = /\/p\//;

/**
 * Returns true when the URL looks like a Substack article.
 * Matches both *.substack.com/p/slug and custom-domain/p/slug patterns.
 */
export function isSubstackUrl(url: string): boolean {
  try {
    const u = new URL(url);
    // Canonical substack.com host
    if (SUBSTACK_HOST_RE.test(url)) return true;
    // Custom domains still use /p/<slug> for posts
    if (CUSTOM_SUBSTACK_PATH_RE.test(u.pathname)) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Fetch a Substack article URL and return its plain-text body.
 */
export async function extractTextFromSubstack(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; CritiqBot/1.0; +https://critiq.app)",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo acceder al artículo de Substack (HTTP ${res.status}).`
    );
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Remove script, style, nav, footer, and other non-content elements
  $(
    "script, style, nav, footer, header, .subscribe-widget, .post-meta, .subscription-widget-wrap"
  ).remove();

  // Substack wraps the post body in a known container
  let body = $(".body.markup").first();
  if (!body.length) body = $(".post-content").first();
  if (!body.length) body = $("article").first();
  if (!body.length) body = $(".available-content").first();

  if (!body.length) {
    throw new Error(
      "No se pudo extraer el contenido del artículo de Substack."
    );
  }

  const text = body.text().replace(/\s+/g, " ").trim();

  if (!text) {
    throw new Error(
      "El artículo de Substack está vacío o no se pudo extraer texto de él."
    );
  }

  return text;
}
