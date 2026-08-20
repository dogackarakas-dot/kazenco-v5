import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PROJECTS } from "@/lib/projects";
import { getLocalizedProject, getLocalizedProjects, getProjectMetadataTitle } from "@/lib/project-translations";
import { SITE } from "@/lib/site";
import { DETAIL_COPY } from "@/lib/detail-translations";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates, SEO_COPY } from "@/lib/seo";
import styles from "./project.module.css";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const project = getLocalizedProject(slug, locale);

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/projects/${project.slug}`;
  const canonical = `/${locale}${path}`;
  const image = project.image ?? "/images/hero/kazenco-refinery-hero.jpg";
  const seoTitle = getProjectMetadataTitle(project.slug, locale)
    ?? `${project.title} ${SEO_COPY[locale].project}`;

  return {
    title: seoTitle,
    description: project.summary,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "KAZENCO",
      title: `${seoTitle} | KAZENCO`,
      description: project.summary,
      images: [{ url: image, alt: `${project.title}, ${project.location}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | KAZENCO`,
      description: project.summary,
      images: [image],
    },
  };
}

export default async function V12ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  if (!localeParam) permanentRedirect(`/en/projects/${slug}`);
  const locale = isLocale(localeParam) ? localeParam : "en";
  const copy = DETAIL_COPY[locale].project;
  const home = `/${locale}`;
  const project = getLocalizedProject(slug, locale);
  if (!project) notFound();

  const cover = project.image;
  const localizedProjects = getLocalizedProjects(locale);
  const activeIndex = localizedProjects.findIndex((item) => item.slug === project.slug);
  const previousProject = localizedProjects[(activeIndex - 1 + localizedProjects.length) % localizedProjects.length];
  const nextProject = localizedProjects[(activeIndex + 1) % localizedProjects.length];
  const projectUrl = `${SITE.url}/${locale}/projects/${project.slug}`;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#project`,
    url: projectUrl,
    name: project.title,
    description: project.summary,
    ...(project.image ? { image: `${SITE.url}${project.image}` } : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    creator: { "@id": `${SITE.url}/#organization` },
    locationCreated: {
      "@type": "Place",
      name: project.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: project.location,
        addressCountry: "KZ",
      },
    },
    about: project.role,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${projectUrl}#breadcrumb`,
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
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href={`${home}#projects`}>← {copy[0]}</Link>
          <p>{project.localizedCategory ?? project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </header>

        <section className={styles.hero} aria-label={`${project.title} ${copy[15]}`}>
          {cover ? (
            <Image
              src={cover}
              alt={`${project.title}, ${project.location}`}
              fill
              preload
              sizes="100vw"
            />
          ) : (
            <div className={styles.fallback}>
              <span>{copy[1]}</span>
            </div>
          )}
          <span className={styles.location}>{project.location}</span>
        </section>

        <section className={styles.story}>
          <div>
            <p>{copy[2]}</p>
            <h2>{copy[3]}</h2>
          </div>
          <div>
            <p>{project.summary}</p>
            <dl>
              <div><dt>{copy[4]}</dt><dd>{project.client ?? project.title}</dd></div>
              <div><dt>{copy[5]}</dt><dd>{project.location}</dd></div>
              <div><dt>{copy[6]}</dt><dd>{project.role}</dd></div>
              <div><dt>{project.year ? copy[7] : copy[8]}</dt><dd>{project.year ?? copy[9]}</dd></div>
            </dl>
          </div>
        </section>

        {project.gallery ? (
          <section className={styles.gallery}>
            <header>
              <p>{copy[10]}</p>
              <h2>{copy[11]}</h2>
            </header>
            <ProjectGallery
              images={project.gallery}
              title={project.title}
              locale={locale}
            />
          </section>
        ) : null}

        <nav className={styles.projectNav} aria-label={copy[14]}>
          <Link href={`/${locale}/projects/${previousProject.slug}`}>
            <span>{copy[12]}</span><strong>{previousProject.title}</strong>
          </Link>
          <Link href={`/${locale}/projects/${nextProject.slug}`}>
            <span>{copy[13]}</span><strong>{nextProject.title}</strong>
          </Link>
        </nav>
      </main>
      <KazencoFooter locale={locale} />
    </>
  );
}
