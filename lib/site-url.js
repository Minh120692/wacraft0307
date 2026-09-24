const FALLBACK_SITE_URL = "https://wacraft-jp.com";

function stripTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();

export const SITE_URL = stripTrailingSlashes(configured || FALLBACK_SITE_URL);

/**
 * Build an absolute URL for a site-relative path.
 * Every emitted URL keeps the `trailingSlash: true` convention of the export.
 */
export function absoluteUrl(path = "/") {
  const raw = String(path || "/");
  const hashAt = raw.indexOf("#");
  const fragment = hashAt === -1 ? "" : raw.slice(hashAt);
  const beforeHash = hashAt === -1 ? raw : raw.slice(0, hashAt);
  const [pathname, query = ""] = beforeHash.split("?");

  let normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  normalized = normalized.replace(/\/+/g, "/");
  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }

  return `${SITE_URL}${normalized}${query ? `?${query}` : ""}${fragment}`;
}

/**
 * Absolute URL for a static file (image, logo, …). Unlike `absoluteUrl` it never
 * appends a trailing slash, and passes through URLs that are already absolute.
 */
export function absoluteAsset(path = "") {
  const raw = String(path || "");
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalized = (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/+/g, "/");
  return `${SITE_URL}${normalized}`;
}
