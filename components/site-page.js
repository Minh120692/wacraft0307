import LegacyScripts from "./legacy-scripts";
import ContactOverlay from "./contact-overlay";
import SiteHeader from "./site-header";
import AosController from "./aos-controller";

export default function SitePage({
  locale = "default",
  activePage = "home",
  intro = null,
  children,
  footer = null,
  scriptSuffix = "",
}) {
  return (
    <>
      <AosController />
      <SiteHeader locale={locale} activePage={activePage} />
      <main className="main">
        {intro}
        {children}
      </main>
      {footer}
      <ContactOverlay locale={locale} />
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
      <LegacyScripts idSuffix={scriptSuffix} />
    </>
  );
}
