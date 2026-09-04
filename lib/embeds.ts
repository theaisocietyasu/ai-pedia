/**
 * Embed allowlist and URL normalization for `<iframe>` elements in article
 * markdown.
 *
 * Articles are edited through pull requests by anyone, so iframes are limited
 * to hosts we trust. Anything else renders as a plain link instead of a frame.
 * To allow a new provider, add its host below.
 */

const ALLOWED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
  "codesandbox.io",
  "codepen.io",
  "stackblitz.com",
  "observablehq.com",
  "huggingface.co",
  "colab.research.google.com",
  "docs.google.com",
  "drive.google.com",
  "www.desmos.com",
  "www.geogebra.org",
  "ai-pedia.ais-asu.com",
] as const;

const YOUTUBE_ID = /^[\w-]{6,20}$/;
const VIMEO_ID = /^\d+$/;

/**
 * Rewrites share URLs into their embeddable form so authors can paste the URL
 * straight from the address bar. Returns the URL unchanged when no rewrite
 * applies.
 */
function toEmbedUrl(url: URL): URL {
  const host = url.hostname.replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    if (YOUTUBE_ID.test(id)) {
      return new URL(`https://www.youtube-nocookie.com/embed/${id}`);
    }
  }

  if (host === "youtube.com" || host === "www.youtube.com") {
    const id = url.searchParams.get("v");
    if (id && YOUTUBE_ID.test(id)) {
      const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      const start = url.searchParams.get("t") ?? url.searchParams.get("start");
      if (start) embed.searchParams.set("start", start.replace(/\D/g, ""));
      return embed;
    }
  }

  if (host === "vimeo.com" || host === "www.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && VIMEO_ID.test(id)) {
      return new URL(`https://player.vimeo.com/video/${id}`);
    }
  }

  return url;
}

/**
 * Returns the embeddable https URL for `src`, or null when the host is not on
 * the allowlist or the URL cannot be parsed.
 */
export function resolveEmbedSrc(src: string | undefined): string | null {
  if (!src) return null;

  let url: URL;
  try {
    url = new URL(src, "https://ai-pedia.ais-asu.com");
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  url = toEmbedUrl(url);

  return (ALLOWED_HOSTS as readonly string[]).includes(url.hostname)
    ? url.toString()
    : null;
}

/** Parses `data-ratio="16/9"` (or "1.777") into a CSS aspect-ratio value. */
export function parseRatio(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(?:[/:]\s*(\d+(?:\.\d+)?))?$/);
  if (!match) return null;
  const w = Number(match[1]);
  const h = match[2] ? Number(match[2]) : 1;
  if (!w || !h) return null;
  return `${w} / ${h}`;
}
