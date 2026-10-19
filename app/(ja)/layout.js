import "../../styles/legacy-inline.css";
import SiteHead from "../../components/site-head";
import { layoutMetadata } from "../../lib/seo";

/** Fallback for any Japanese page that sets no metadata of its own. */
export const metadata = layoutMetadata("default");

/** Root layout of the Japanese locale: every route outside `/en/`. */
export default function JapaneseRootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <SiteHead />
      </head>
      <body className="index-page" suppressHydrationWarning>{children}</body>
    </html>
  );
}
