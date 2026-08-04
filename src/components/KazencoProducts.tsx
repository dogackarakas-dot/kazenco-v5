import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import { productCopy, productReferenceLabels } from "@/lib/product-translations";

const PRODUCTS = [
  {
    number: "01",
    title: "Pipes & Tubes",
    eyebrow: "Piping systems",
    description:
      "Carbon steel, stainless steel and alloy steel pipes and tubes for refinery, petrochemical, energy and industrial projects.",
    referenceSpecs: ["ASTM", "ASME", "API"],
    image: "/images/products/pipes-tubes.png",
  },
  {
    number: "02",
    title: "Fittings & Flanges",
    eyebrow: "Connection systems",
    description:
      "Forged and butt-weld fittings, flanges and connection components supplied to international project standards.",
    referenceSpecs: ["ASME B16.5", "ASME B16.9", "ASME B16.11"],
    image: "/images/products/fittings-flanges.png",
  },
  {
    number: "03",
    title: "Valves & Instrumentation",
    eyebrow: "Flow control",
    description:
      "Process valves, instrumentation valves, tubing and control components for critical industrial service.",
    referenceSpecs: ["API", "ASME", "NACE"],
    image: "/images/products/valves-instrumentation.png",
  },
  {
    number: "04",
    title: "Fasteners & Anchor Bolts",
    eyebrow: "Connection hardware",
    description:
      "Stud bolts, anchor bolts, nuts, washers and custom fastening packages supported by material documentation.",
    referenceSpecs: ["ASTM A193", "ASTM A320", "ASTM A194"],
    image: "/images/products/fasteners-anchor-bolts.png",
  },
  {
    number: "05",
    title: "Electrical Equipment",
    eyebrow: "Electrical supply",
    description:
      "Project-based sourcing of electrical equipment, accessories and supporting industrial materials.",
    referenceSpecs: ["IEC", "ATEX", "IP ratings"],
    image: "/images/products/electrical-equipment.png",
  },
  {
    number: "06",
    title: "Construction Materials",
    eyebrow: "Site materials",
    description:
      "Coordinated supply of construction, fit-out, furnishing and site materials for project delivery across Kazakhstan.",
    referenceSpecs: ["QA/QC", "MTC", "CoC"],
    image: "/images/products/construction-materials.png",
  },
];

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

      <div className="kazenco-v9-product-grid">
        {PRODUCTS.map((product, index) => {
          const translated = translatedProducts[index];
          return (
          <a
            className={`kazenco-v9-product-card${index === 0 ? " is-featured" : ""}`}
            href="#contact"
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

              <span className="kazenco-product-spec-label">{copy[3]}</span>
              <ul aria-label={`${translated.title} — ${copy[3]}`}>
                {product.referenceSpecs.map((specification) => (
                  <li key={specification}>{specification}</li>
                ))}
              </ul>

              <span className="kazenco-v9-product-link">{copy[4]}</span>
            </div>
          </a>
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
