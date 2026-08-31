import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { DeferredContactModal } from "@/components/DeferredContactModal";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import {
  getProductDetail,
  getProductImageAlt,
  isProductDetailSlug,
  PRODUCT_DETAIL_SLUGS,
  type ProductDetailSlug,
} from "@/lib/product-detail-translations";
import { productCopy } from "@/lib/product-translations";
import { localizedAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";
import styles from "./product.module.css";

const PRODUCT_IMAGES: Record<ProductDetailSlug, string> = {
  "pipes-tubes": "/images/products/pipes-tubes-realistic-v1.webp",
  "fittings-flanges": "/images/products/fittings-flanges-realistic-v1.webp",
  "valves-instrumentation": "/images/products/valves-instrumentation-realistic-v1.webp",
  "fasteners-anchor-bolts": "/images/products/fasteners-anchor-bolts-real-v1.webp",
  "electrical-equipment": "/images/products/electrical-equipment.webp",
  "construction-materials": "/images/products/construction-materials.webp",
};

export function generateStaticParams() {
  return PRODUCT_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  if (!isProductDetailSlug(slug)) {
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  const productIndex = PRODUCT_DETAIL_SLUGS.indexOf(slug);
  const product = productCopy(locale)[productIndex];
  const productImage = PRODUCT_IMAGES[slug];
  const productImageAlt = getProductImageAlt(slug, locale);
  const path = `/products/${slug}`;
  const canonical = `/${locale}${path}`;
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${product.title} | KAZENCO`,
      description: product.description,
      images: [{ url: productImage, alt: productImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | KAZENCO`,
      description: product.description,
      images: [productImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  if (!localeParam) permanentRedirect(`/en/products/${slug}`);
  if (!isProductDetailSlug(slug)) notFound();

  const locale = isLocale(localeParam) ? localeParam : "en";
  const productIndex = PRODUCT_DETAIL_SLUGS.indexOf(slug);
  const product = productCopy(locale)[productIndex];
  const copy = getProductDetail(slug, locale);
  const productImage = PRODUCT_IMAGES[slug];
  const productImageAlt = getProductImageAlt(slug, locale);
  const productUrl = `${SITE.url}/${locale}/products/${slug}`;
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${productUrl}#product-range`,
    url: productUrl,
    name: product.title,
    description: product.description,
    image: `${SITE.url}${productImage}`,
    provider: { "@id": `${SITE.url}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: product.productRange.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: NAVIGATION[locale].home,
        item: `${SITE.url}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page} data-locale={locale} data-product={slug}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Link href={`/${locale}/products`}>← {copy.back}</Link>
            <p>{copy.category}</p>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
          </div>
          <figure className={styles.heroMedia}>
            <Image src={productImage} alt={productImageAlt} fill preload sizes="(max-width: 900px) 100vw, 50vw" />
          </figure>
        </header>

        <section className={styles.overview}>
          <div>
            <p>{copy.overviewKicker}</p>
            <h2>{copy.overviewTitle}</h2>
          </div>
          <p>{copy.overview}</p>
        </section>

        <section className={styles.range}>
          <header>
            <p>{copy.rangeKicker}</p>
            <h2>{copy.rangeTitle}</h2>
          </header>
          <div>
            {copy.range.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.technical}>
          <header>
            <p>{copy.technicalKicker}</p>
            <h2>{copy.technicalTitle}</h2>
          </header>
          <dl>
            {copy.technical.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.process}>
          <header>
            <p>{copy.processKicker}</p>
            <h2>{copy.processTitle}</h2>
          </header>
          <div>
            {copy.process.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.rfq}>
          <div>
            <p>{copy.rfqKicker}</p>
            <h2>{copy.rfqTitle}</h2>
            <p>{copy.rfqIntro}</p>
            <div className={styles.actions}>
              <DeferredContactModal triggerClassName={styles.primaryAction} triggerLabel={copy.primaryCta} />
              <Link href={`/${locale}/capabilities/industrial-procurement-supply`}>{copy.secondaryCta}</Link>
            </div>
          </div>
          <ul>
            {copy.rfqItems.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ul>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
