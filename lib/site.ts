/** Canonical site origin, without a trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ai-pedia.ais-asu.com"
).replace(/\/+$/, "");

export const SITE_NAME = "AI Pedia";

export const SITE_DESCRIPTION =
  "An encyclopedia of artificial intelligence with interactive explanations of core algorithms, written by The AI Society at Arizona State University.";

export const SITE_DESCRIPTION_SHORT =
  "Interactive explanations of core AI algorithms, by The AI Society at ASU.";
