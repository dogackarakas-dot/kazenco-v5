import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { productCopy } from "@/lib/product-translations";
import { PRODUCTS } from "@/lib/products";
import { localizedAlternates } from "@/lib/seo";
import { sectionCopy } from "@/lib/section-translations";
import { SITE } from "@/lib/site";
import styles from "./products.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const copy = sectionCopy(locale).products;
  const pageTitle = copy[0];
  const description = copy[2];
  const path = "/products";
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

export default async function ProductsIndexPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/products");
  const locale = isLocale(localeParam) ? localeParam : "en";
  if (!isLocale(localeParam)) notFound();

  const copy = sectionCopy(locale).products;
  const translatedProducts = productCopy(locale);
  const home = `/${locale}`;
  const pageUrl = `${SITE.url}/${locale}/products`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#products`,
    url: pageUrl,
    name: copy[0],
    description: copy[2],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PRODUCTS.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: translatedProducts[index].title,
        url: `${SITE.url}/${locale}/products/${product.slug}`,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].products, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <Link className={styles.back} href={`${home}#products`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <section id="products" className="kazenco-v5-section kazenco-v9-products">
          <div className="kazenco-v5-section-head">
            <div>
              <p className="kazenco-section-kicker">{copy[0]}</p>
              <h1>{copy[1]}</h1>
            </div>
            <p>{copy[2]}</p>
          </div>

          <div className="kazenco-v9-product-grid">
            {PRODUCTS.map((product, index) => {
              const translated = translatedProducts[index];
              const productScopeHref = `/${locale}/products/${product.slug}`;
              return (
                <article
                  className={`kazenco-v9-product-card${index === 0 ? " is-featured" : ""}`}
                  key={product.number}
                >
                  <div className="kazenco-v9-product-top">
                    <div>
                      <span className="kazenco-v9-product-number">{product.number}</span>
                      <p className="kazenco-v9-product-eyebrow">{translated.eyebrow}</p>
                    </div>
                    <span className="kazenco-v9-product-arrow" aria-hidden="true">↗</span>
                  </div>

                  <div className="kazenco-v10-product-media">
                    <Image
                      src={product.image}
                      alt={translated.title}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 34vw"
                    />
                  </div>

                  <div className="kazenco-v9-product-copy">
                    <h2>{translated.title}</h2>
                    <p>{translated.description}</p>

                    <span className="kazenco-product-range-label">{copy[8]}</span>
                    <ul className="kazenco-product-range">
                      {translated.productRange.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <span className="kazenco-product-spec-label">{copy[3]}</span>
                    <ul
                      aria-label={`${translated.title} — ${copy[3]}`}
                      className="kazenco-product-specs"
                    >
                      {product.referenceSpecs.map((specification) => (
                        <li key={specification}>{specification}</li>
                      ))}
                    </ul>

                    <div className="kazenco-v9-product-actions">
                      <Link className="kazenco-v9-product-link" href={productScopeHref}>
                        {copy[4]}
                      </Link>
                      <Link className="kazenco-v9-product-request" href={`/${locale}/contact`}>
                        {copy[7]}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
