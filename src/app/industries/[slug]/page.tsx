import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import Image from "next/image";
import { CAPABILITIES } from "@/lib/capabilities";
import { getLocalizedCapability } from "@/lib/capability-translations";
import { DETAIL_COPY } from "@/lib/detail-translations";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { getLocalizedIndustry } from "@/lib/industry-translations";
import { INDUSTRIES } from "@/lib/industries";
import { INDUSTRY_PRODUCT_SLUGS } from "@/lib/industry-products";
import { productCopy } from "@/lib/product-translations";
import { PRODUCTS } from "@/lib/products";
import { localizedAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";
import styles from "./industry.module.css";

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const industry = getLocalizedIndustry(slug, locale);

  if (!industry) return { title: "Industry not found", robots: { index: false, follow: false } };

  const path = `/industries/${industry.slug}`;
  const canonical = `/${locale}${path}`;
  return {
    title: industry.title,
    description: industry.description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${industry.title} | KAZENCO`,
      description: industry.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${industry.title} | KAZENCO`,
      description: industry.description,
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  if (!localeParam) permanentRedirect(`/en/industries/${slug}`);
  const locale = isLocale(localeParam) ? localeParam : "en";
  const industry = getLocalizedIndustry(slug, locale);
  if (!industry) notFound();

  const copy = DETAIL_COPY[locale].industry;
  const home = `/${locale}`;
  const industryUrl = `${SITE.url}/${locale}/industries/${industry.slug}`;
  const relatedCapabilities = CAPABILITIES.map((capability) => getLocalizedCapability(capability.slug, locale)).filter(
    (capability) => capability !== undefined,
  );

  const translatedProducts = productCopy(locale);
  const relatedProducts = (INDUSTRY_PRODUCT_SLUGS[slug] ?? [])
    .map((productSlug) => {
      const index = PRODUCTS.findIndex((product) => product.slug === productSlug);
      if (index === -1) return undefined;
      return { ...PRODUCTS[index], ...translatedProducts[index] };
    })
    .filter((product) => product !== undefined);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${industryUrl}#service`,
    name: industry.title,
    description: industry.description,
    url: industryUrl,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "Country", name: "Kazakhstan" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${industryUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: industry.title, item: industryUrl },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <header className={styles.hero}>
          <Link href={`/${locale}/industries`}>← {copy[0]}</Link>
          <p>{copy[1]} {industry.number}</p>
          <h1>{industry.title}</h1>
          <p>{industry.description}</p>
        </header>

        <section className={styles.delivery}>
          <header>
            <p>{copy[2]}</p>
            <h2>{copy[3]}</h2>
          </header>
          <div>
            {relatedCapabilities.map((capability, index) => (
              <article key={capability.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>
                  <Link href={`/${locale}/capabilities/${capability.slug}`}>{capability.title}</Link>
                </h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className={styles.products}>
            <header>
              <p>{copy[7]}</p>
              <h2>{copy[8]}</h2>
            </header>
            <div>
              {relatedProducts.map((product) => (
                <article key={product.slug}>
                  <div className={styles.productMedia}>
                    <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                  <h3>
                    <Link href={`/${locale}/products/${product.slug}`}>{product.title}</Link>
                  </h3>
                  <p>{product.description}</p>
                  <ul className="kazenco-product-specs" aria-label={`${product.title} — reference specifications`}>
                    {product.referenceSpecs.map((specification) => (
                      <li key={specification}>{specification}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={styles.cta}>
          <p>{copy[4]}</p>
          <h2>{copy[5]}</h2>
          <Link href={`${home}#contact`}>{copy[6]} ↗</Link>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
