/**
 * Helper to get the canonical base URL of the site.
 * Prioritizes NEXT_PUBLIC_SITE_URL, then VERCEL_URL, with a fallback.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  return "https://burmesehouse.com";
}

export function getAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
