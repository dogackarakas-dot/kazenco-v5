import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { getLocalizedProjects } from "@/lib/project-translations";
import { localizedAlternates } from "@/lib/seo";
import { sectionCopy } from "@/lib/section-translations";
import { SITE } from "@/lib/site";
import styles from "./projects.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const copy = sectionCopy(locale).portfolio;
  const pageTitle = copy[0];
  const description = copy[2];
  const path = "/projects";
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

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/projects");
  const locale = isLocale(localeParam) ? localeParam : "en";
  if (!isLocale(localeParam)) notFound();

  const copy = sectionCopy(locale).portfolio;
  const projects = getLocalizedProjects(locale);
  const home = `/${locale}`;
  const pageUrl = `${SITE.url}/${locale}/projects`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#projects`,
    url: pageUrl,
    name: copy[0],
    description: copy[2],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${SITE.url}/${locale}/projects/${project.slug}`,
      })),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].projects, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <Link className={styles.back} href={`${home}#projects`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <section id="projects" className="kazenco-v5-section">
          <div className="kazenco-v5-section-head">
            <div>
              <p className="kazenco-section-kicker">{copy[0]}</p>
              <h1>{copy[1]}</h1>
            </div>
            <p>{copy[2]}</p>
          </div>

          <div className="kazenco-v11-case-studies">
            {projects.map((project, index) => (
              <article
                className={`kazenco-v11-case-study ${index % 2 === 1 ? "is-reversed" : ""}`}
                key={project.slug}
              >
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="kazenco-v11-case-media"
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 920px) 100vw, 55vw"
                    />
                  ) : (
                    <div
                      className="kazenco-v11-case-fallback"
                      style={{ background: project.gradient }}
                    >
                      <span>{project.title}</span>
                    </div>
                  )}
                  <span className="kazenco-v11-case-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="kazenco-v11-case-view">{copy[3]} ↗</span>
                </Link>

                <div className="kazenco-v11-case-copy">
                  <p className="kazenco-v11-case-label">
                    {project.localizedCategory ?? project.category ?? "Project delivery"}
                  </p>
                  <h2>{project.title}</h2>
                  <p className="kazenco-v11-case-summary">{project.summary}</p>
                  <dl>
                    <div><dt>{copy[5]}</dt><dd>{project.client || project.title}</dd></div>
                    <div><dt>{copy[6]}</dt><dd>{project.location}</dd></div>
                    <div><dt>{copy[7]}</dt><dd>{project.role}</dd></div>
                    <div><dt>{project.year ? copy[8] : copy[9]}</dt><dd>{project.year || copy[10]}</dd></div>
                  </dl>
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="kazenco-v11-case-link"
                  >
                    {copy[3]} <span aria-hidden="true">↗</span>
                  </Link>
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
