import Link from "next/link";
import { getPageChrome } from "../lib/site-content";

function navClass(href, activeHref) {
  return href === activeHref ? "active" : undefined;
}

export default function SiteHeader({ locale = "default", activePage = "home" }) {
  const chrome = getPageChrome(locale);
  const activeHref = chrome[`${activePage}Href`] ?? chrome.homeHref;

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative">
        <div className="header-shell d-flex align-items-center justify-content-between">
          <Link href={chrome.logoHref} className="logo d-flex align-items-center">
            <img src="/assets/img/logo-removebg-preview.png" alt="WA+CRAFT logo" className="logo-img" />
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li><Link href={chrome.homeHref} className={navClass(chrome.homeHref, activeHref)}>Home</Link></li>
              <li><Link href={chrome.aboutHref} className={navClass(chrome.aboutHref, activeHref)}>About Us</Link></li>
              <li><Link href={chrome.solutionsHref} className={navClass(chrome.solutionsHref, activeHref)}>Our Solutions</Link></li>
              <li><Link href={chrome.whyUsHref} className={navClass(chrome.whyUsHref, activeHref)}>Why Choose Us</Link></li>
              <li><Link href={chrome.teamHref} className={navClass(chrome.teamHref, activeHref)}>Team</Link></li>
              <li><a href="#contact" data-contact-trigger="true">Contact</a></li>
              <li><Link href={chrome.langHref} className="lang-switch">{chrome.langLabel}</Link></li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>
  );
}
