import { absoluteAsset } from "../lib/site-url.js";

// Reading NEXT_PUBLIC_SITE_URL would otherwise mark this route dynamic,
// which `output: "export"` rejects.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteAsset("/sitemap.xml"),
  };
}
