import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import { productCopy, productReferenceLabels } from "@/lib/product-translations";
import { PRODUCTS } from "@/lib/products";

const PRODUCT_REFERENCE_IMAGES = [
  {
    src: "/images/projects/industrial-site.jpeg",
    label: "Structural steel components",
  },
  {
    src: "/images/projects/rolled-metal-products.jpeg",
    label: "Rolled metal products",
  },
  {
    src: "/images/projects/steel-structures.png",
    label: "Steel fabrication facility",
  },
  {
    src: "/images/projects/tco-manufacturing.png",
    label: "Fabricated steel components",
  },
  {
    src: "/images/projects/tengiz-karabatan-project.jpeg",
    label: "Structural profiles and tubes",
  },
];

export function KazencoProducts({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).products;
  const translatedProducts = productCopy(locale);
  const referenceLabels = productReferenceLabels[locale];
  return (
    <section id="products" className="kazenco-v5-section kazenco-v9-products">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          <h2>{copy[1]}</h2>
        </div>
        <p>{copy[2]}</p>
      </div>

      <div className="kazenco-catalog-cta">
        <a
          href="/catalog/kazenco-katalog-web.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="kazenco-catalog-button"
          aria-label={`${copy[9]}`}
        >
          <span aria-hidden="true">↓</span>
          {copy[9]}
        </a>
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
              <h3>{translated.title}</h3>
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
                <a className="kazenco-v9-product-request" href="#contact">
                  {copy[7]}
                </a>
              </div>
            </div>
          </article>
          );
        })}
      </div>

      <div className="kazenco-product-references">
        <div className="kazenco-product-references-head">
          <p className="kazenco-section-kicker">{copy[5]}</p>
          <p>{copy[6]}</p>
        </div>
        <div className="kazenco-product-reference-grid">
          {PRODUCT_REFERENCE_IMAGES.map((item, index) => (
            <figure className="kazenco-product-reference" key={item.src}>
              <Image
                src={item.src}
                alt={referenceLabels[index]}
                fill
                sizes="(max-width: 660px) 100vw, (max-width: 980px) 50vw, 33vw"
              />
              <figcaption>{referenceLabels[index]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
