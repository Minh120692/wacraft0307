import Link from "next/link";

import LegacyScripts from "./legacy-scripts";
import SiteHeader from "./site-header";
import AosController from "./aos-controller";
import { pageHref } from "../lib/site-content";

export default function SitePage({
  locale = "default",
  activePage = "home",
  intro = null,
  children,
  footer = null,
  scriptSuffix = "",
  langHref = null,
}) {
  return (
    <>
      <AosController />
      <SiteHeader locale={locale} activePage={activePage} langHref={langHref} />
      <main className="main">
        {intro}
        {children}
      </main>
      {footer}
      {activePage !== "contact" && (
        <Link href={pageHref("contact", locale)} className="floating-contact-btn" aria-label="Contact">
          <i className="bi bi-chat-dots-fill"></i>
        </Link>
      )}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
      <LegacyScripts idSuffix={scriptSuffix} />
    </>
  );
}
