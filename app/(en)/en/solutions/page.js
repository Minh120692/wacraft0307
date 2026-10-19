import SitePage from "../../../../components/site-page";
import enSections from "../../../../content/en/index.js";
import { relatedPostsByService } from "../../../../lib/blog";
import { pageMetadata } from "../../../../lib/seo";

const LOCALE = "en";

export const metadata = pageMetadata("solutions", LOCALE);

export default function EnglishSolutionsPage() {
  const Solutions = enSections.solutions;
  const Footer = enSections.footer;
  const related = relatedPostsByService(LOCALE);

  return (
    <SitePage
      locale={LOCALE}
      activePage="solutions"
      footer={<Footer />}
      scriptSuffix="-en-solutions"
    >
      <Solutions related={related} />
    </SitePage>
  );
}
