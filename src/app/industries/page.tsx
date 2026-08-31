import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { getLocalizedIndustries } from "@/lib/industry-translations";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { HOME_COPY } from "@/lib/home-translations";
import styles from "./industries.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const copy = HOME_COPY[locale].industries;
  const path = "/industries";
  const canonical = `/${locale}${path}`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${copy.title} | KAZENCO`,
      description: copy.intro,
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} | KAZENCO`,
      description: copy.intro,
    },
  };
}

export default async function IndustriesIndexPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/industries");
  const locale = isLocale(localeParam) ? localeParam : "en";
  if (!isLocale(localeParam)) notFound();

  const copy = HOME_COPY[locale].industries;
  const industries = getLocalizedIndustries(locale);
  const home = `/${locale}`;
  const pageUrl = `${SITE.url}/${locale}/industries`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#industries`,
    url: pageUrl,
    name: copy.title,
    description: copy.intro,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: industries.map((industry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: industry.title,
        url: `${SITE.url}/${locale}/industries/${industry.slug}`,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: copy.title, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <Link className={styles.back} href={`${home}#industries`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <section id="industries" className="kazenco-v5-section">
          <div className="kazenco-v5-section-head">
            <div>
              <p className="kazenco-section-kicker">{copy.kicker}</p>
              <h1>{copy.title}</h1>
            </div>
            <p>{copy.intro}</p>
          </div>

          <div className="kazenco-v5-industry-grid">
            {industries.map((industry) => (
              <Link
                className="kazenco-v5-industry-card"
                href={`/${locale}/industries/${industry.slug}`}
                key={industry.slug}
              >
                <span>{industry.number}</span>
                <h3>{industry.title}</h3>
                <p>{industry.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
