import "../../../styles/legacy-inline.css";
import SiteHead from "../../../components/site-head";
import { layoutMetadata } from "../../../lib/seo";

/** Fallback for any English page that sets no metadata of its own. */
export const metadata = layoutMetadata("en");

/** Root layout of the English locale: every route under `/en/`. */
export default function EnglishRootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SiteHead />
      </head>
      <body className="index-page" suppressHydrationWarning>{children}</body>
    </html>
  );
}
