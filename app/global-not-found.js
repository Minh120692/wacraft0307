import "../styles/legacy-inline.css";
import SiteHead from "../components/site-head";
import { notFoundMetadata } from "../lib/seo";

export const metadata = notFoundMetadata();

/*
 * Each locale has its own root layout, so no layout wraps an unknown URL. This page
 * brings its own document in the primary locale (Japanese) and keeps the message
 * and look of Next's built-in 404 that `out/404.html` showed before the split.
 * The message itself is English, so it carries its own `lang="en"`.
 */
const STYLES = {
  error: {
    fontFamily:
      'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    display: "inline-block",
    margin: "0 20px 0 0",
    padding: "0 23px 0 0",
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: "top",
    lineHeight: "49px",
  },
  desc: { display: "inline-block" },
  h2: { fontSize: 14, fontWeight: 400, lineHeight: "49px", margin: 0 },
};

/*
 * Light colours only: the site CSS has no dark theme and paints headings black, so a
 * dark-mode background (as in Next's own 404 CSS) would hide the message.
 */
const FALLBACK_CSS =
  "body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}";

export default function GlobalNotFound() {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <SiteHead />
      </head>
      <body className="index-page" suppressHydrationWarning>
        <div style={STYLES.error}>
          <div>
            <style dangerouslySetInnerHTML={{ __html: FALLBACK_CSS }} />
            <h1 className="next-error-h1" style={STYLES.h1}>404</h1>
            <div style={STYLES.desc}>
              <h2 style={STYLES.h2} lang="en">This page could not be found.</h2>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
