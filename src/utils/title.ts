import { requestUrl } from "obsidian";

/**
 * Decode HTML entities in string
 */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™");
}

/**
 * Extract title from HTML content
 */
export function extractTitle(html: string): string | null {
  // Match <title>...</title> handling multiline and attributes
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    let title = titleMatch[1];
    // Remove HTML tags inside title if any
    title = title.replace(/<[^>]*>/g, "");
    // Normalize whitespace
    title = title.replace(/\s+/g, " ").trim();
    title = decodeHtmlEntities(title);
    if (title) return title;
  }

  // Fallback to meta tags (og:title, twitter:title, title)
  const metaPatterns = [
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i,
    /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:title["']/i,
    /<meta[^>]*name=["']title["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']title["']/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let title = match[1].trim();
      title = decodeHtmlEntities(title);
      if (title) return title;
    }
  }

  return null;
}

/**
 * Fetch web page title from URL
 */
export function fetchTitle(url: string): Promise<string | null> {
  const targetUrl = /^[a-z]+:\/\//i.test(url) ? url : `https://${url}`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  };

  if (typeof requestUrl === "function") {
    return requestUrl({ url: targetUrl, headers })
      .then((res) => {
        if (res && res.text) {
          return extractTitle(res.text);
        }
        return null;
      })
      .catch((err) => {
        console.error("Failed to fetch title for URL:", url, err);
        return null;
      });
  } else if (typeof fetch === "function") {
    return fetch(targetUrl, { headers })
      .then((res) => res.text())
      .then((html) => extractTitle(html))
      .catch((err) => {
        console.error("Failed to fetch title for URL:", url, err);
        return null;
      });
  }

  return Promise.resolve(null);
}
