import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { CAPABILITIES } from "@/lib/capabilities";
import { getLocalizedCapability } from "@/lib/capability-translations";
import { getLocalizedProject } from "@/lib/project-translations";
import { SITE } from "@/lib/site";
import { DETAIL_COPY } from "@/lib/detail-translations";
import { isLocale } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import styles from "./capability.module.css";

export function generateStaticParams() {
  return CAPABILITIES.map((capability) => ({ slug: capability.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale?: string }> }): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const capability = getLocalizedCapability(slug, locale);

  if (!capability) return { title: "Capability not found", robots: { index: false, follow: false } };

  const path = `/capabilities/${capability.slug}`;
  const canonical = `/${locale}${path}`;
  return {
    title: capability.title,
    description: capability.description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${capability.title} | KAZENCO`,
      description: capability.description,
      images: [{ url: "/images/hero/kazenco-refinery-hero.jpg", alt: `${capability.title} by KAZENCO` }],
    },
  };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string; locale?: string }> }) {
  const { slug, locale: localeParam } = await params;
  if (!localeParam) permanentRedirect(`/en/capabilities/${slug}`);
  const locale = isLocale(localeParam) ? localeParam : "en";
  const copy = DETAIL_COPY[locale].capability;
  const home = `/${locale}`;
  const capability = getLocalizedCapability(slug, locale);
  if (!capability) notFound();

  const relatedProjects = capability.relatedProjectSlugs
    .map((projectSlug) => getLocalizedProject(projectSlug, locale))
    .filter((project) => project !== undefined);
  const capabilityUrl = `${SITE.url}/${locale}/capabilities/${capability.slug}`;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${capabilityUrl}#service`,
    url: capabilityUrl,
    name: capability.title,
    serviceType: capability.title,
    description: capability.description,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "Kazakhstan",
    },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <PremiumHeader />
      <main className={styles.page} data-locale={locale}>
        <header className={styles.hero}>
          <Link href={`${home}#capabilities`}>← {copy[0]}</Link>
          <p>{copy[1]} {capability.number}</p>
          <h1>{capability.title}</h1>
          <p>{capability.overview}</p>
        </header>

        <section className={styles.scope}>
          <div>
            <p>{copy[2]}</p>
            <h2>{copy[3]}</h2>
          </div>
          <ul>
            {capability.scope.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.delivery}>
          <header>
            <p>{copy[4]}</p>
            <h2>{copy[5]}</h2>
          </header>
          <div>
            {capability.delivery.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.projects}>
          <header>
            <p>{copy[6]}</p>
            <h2>{copy[7]}</h2>
          </header>
          <div>
            {relatedProjects.map((project) => (
              <Link href={`/${locale}/projects/${project.slug}`} key={project.slug}>
                <figure>
                  {project.image ? <Image src={project.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" /> : null}
                </figure>
                <span>{project.location}</span>
                <h3>{project.title}</h3>
                <p>{project.role}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <p>{copy[8]}</p>
          <h2>{copy[9]}</h2>
          <Link href={`${home}#contact`}>{copy[10]} ↗</Link>
        </section>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
