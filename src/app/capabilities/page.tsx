import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { CAPABILITIES } from "@/lib/capabilities";
import { getLocalizedCapability } from "@/lib/capability-translations";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { sectionCopy } from "@/lib/section-translations";
import { SITE } from "@/lib/site";
import styles from "./capabilities.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const copy = sectionCopy(locale).capabilities;
  const pageTitle = copy[0];
  const description = copy[2];
  const path = "/capabilities";
  const canonical = `/${locale}${path}`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${pageTitle} | KAZENCO`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | KAZENCO`,
      description,
    },
  };
}

export default async function CapabilitiesIndexPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/capabilities");
  const locale = isLocale(localeParam) ? localeParam : "en";
  if (!isLocale(localeParam)) notFound();

  const copy = sectionCopy(locale).capabilities;
  const capabilities = CAPABILITIES.map((capability) => getLocalizedCapability(capability.slug, locale) ?? capability);
  const home = `/${locale}`;
  const pageUrl = `${SITE.url}/${locale}/capabilities`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#capabilities`,
    url: pageUrl,
    name: copy[0],
    description: copy[2],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: capabilities.map((capability, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: capability.title,
        url: `${SITE.url}/${locale}/capabilities/${capability.slug}`,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].capabilities, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <Link className={styles.back} href={`${home}#capabilities`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <section id="capabilities" className="kazenco-v5-section kazenco-capabilities">
          <header className="kazenco-capabilities-head">
            <div>
              <p className="kazenco-section-kicker">{copy[0]}</p>
              <h1>{copy[1]}</h1>
            </div>
            <div>
              <p>{copy[2]}</p>
              <Link href={`/${locale}/contact`}>{copy[3]} <span aria-hidden="true">↗</span></Link>
            </div>
          </header>

          <div className="kazenco-capabilities-grid">
            {capabilities.map((capability) => (
              <article key={capability.slug} className="kazenco-capability-card">
                <span>{capability.number}</span>
                <h2>{capability.title}</h2>
                <div>
                  <p>{capability.description}</p>
                  <ul aria-label={`${capability.title} scope`}>
                    {capability.scope.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link href={`/${locale}/capabilities/${capability.slug}`}>{copy[4]} <span aria-hidden="true">↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
