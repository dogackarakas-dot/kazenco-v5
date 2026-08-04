import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";

type Props = {
  projects: Project[];
  locale?: Locale;
};

export function KazencoProjectPortfolio({ projects, locale = "en" }: Props) {
  const copy = sectionCopy(locale).portfolio;
  return (
    <section
      id="other-projects"
      className="kazenco-v11-portfolio kazenco-v11-portfolio-embedded"
    >
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
              <h3>{project.title}</h3>
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
  );
}
