import Image from "next/image";
import Link from "next/link";
import { KazencoProjectPortfolio } from "@/components/KazencoProjectPortfolio";
import { FEATURED_PROJECT_SLUGS } from "@/lib/projects";
import type { Project } from "@/types/project";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import styles from "./KazencoV12Portfolio.module.css";

type Props = { projects: Project[]; locale?: Locale };

export function KazencoV12Portfolio({ projects, locale = "en" }: Props) {
  const copy = sectionCopy(locale).portfolio;
  const featured = FEATURED_PROJECT_SLUGS.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });
  const featuredSlugs = new Set(FEATURED_PROJECT_SLUGS);
  const otherProjects = projects.filter(
    (project) => !featuredSlugs.has(project.slug as (typeof FEATURED_PROJECT_SLUGS)[number]),
  );

  return (
    <section id="projects" className={styles.portfolio}>
      <header className={styles.intro}>
        <p className="kazenco-section-kicker">{copy[0]}</p>
        <h2>{copy[1]}</h2>
        <p>{copy[2]}</p>
      </header>

      <div className={styles.cases}>
        {featured.map((project, index) => {
          const cover = project.image;

          return (
            <article className={styles.caseStudy} key={project.slug}>
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className={styles.hero}
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={`${project.title}, ${project.location}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 90vw"
                  />
                ) : (
                  <span className={styles.fallback}>
                    <span>{copy[4]}</span>
                  </span>
                )}
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.explore}>{copy[3]} ↗</span>
              </Link>

              <div className={styles.story}>
                <div className={styles.title}>
                  <p>{project.localizedCategory ?? project.category}</p>
                  <h3>{project.title}</h3>
                </div>
                <p className={styles.summary}>{project.summary}</p>
                <dl className={styles.facts}>
                  <div><dt>{copy[5]}</dt><dd>{project.client ?? project.title}</dd></div>
                  <div><dt>{copy[6]}</dt><dd>{project.location}</dd></div>
                  <div><dt>{copy[7]}</dt><dd>{project.role}</dd></div>
                  <div><dt>{project.year ? copy[8] : copy[9]}</dt><dd>{project.year ?? copy[10]}</dd></div>
                </dl>
                <Link href={`/${locale}/projects/${project.slug}`} className={styles.textLink}>
                  {copy[3]} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.original}>
        <div className={styles.originalLabel}>
          <p className="kazenco-section-kicker">{copy[11]}</p>
          <p>{copy[12]}</p>
        </div>
        <KazencoProjectPortfolio projects={otherProjects} locale={locale} />
      </div>
    </section>
  );
}
