import SitePage from "../../../components/site-page";
import defaultSections from "../../../content/default/index.js";
import { relatedPostsByService } from "../../../lib/blog";
import { pageMetadata } from "../../../lib/seo";

const LOCALE = "default";

export const metadata = pageMetadata("solutions", LOCALE);

export default function SolutionsPage() {
  const Solutions = defaultSections.solutions;
  const Footer = defaultSections.footer;
  const related = relatedPostsByService(LOCALE);

  return (
    <SitePage
      locale={LOCALE}
      activePage="solutions"
      footer={<Footer />}
      scriptSuffix="-solutions"
    >
      <Solutions related={related} />
    </SitePage>
  );
}
