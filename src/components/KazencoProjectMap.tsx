"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getLocalizedProjects } from "@/lib/project-translations";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import type { Project } from "@/types/project";
import styles from "./KazencoProjectMap.module.css";

type CityKey = "atyrau" | "tengiz" | "karabatan" | "aktau" | "aksai" | "almaty";
type Filter = "All" | NonNullable<Project["category"]>;

const CITIES: { key: CityKey; name: string }[] = [
  { key: "atyrau", name: "Atyrau" },
  { key: "tengiz", name: "Tengiz" },
  { key: "karabatan", name: "Karabatan" },
  { key: "aktau", name: "Aktau" },
  { key: "aksai", name: "Aksai" },
  { key: "almaty", name: "Almaty" },
];

const FILTERS: Filter[] = [
  "All",
  "Construction",
  "Fit-out & Furnishing",
  "Material Supply",
  "Assembly",
];

const MARKER_CLASS: Record<CityKey, string> = {
  atyrau: styles.markerAtyrau,
  tengiz: styles.markerTengiz,
  karabatan: styles.markerKarabatan,
  aktau: styles.markerAktau,
  aksai: styles.markerAksai,
  almaty: styles.markerAlmaty,
};

function getCityKey(location: string | undefined): CityKey | null {
  if (!location) return null;
  const normalized = location.toLowerCase();
  if (normalized.includes("tengiz")) return "tengiz";
  if (normalized.includes("karabatan")) return "karabatan";
  if (normalized.includes("atyrau")) return "atyrau";
  if (normalized.includes("aktau")) return "aktau";
  if (normalized.includes("aksai")) return "aksai";
  if (normalized.includes("almaty")) return "almaty";
  return null;
}

export function KazencoProjectMap({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).map;
  const [filter, setFilter] = useState<Filter>("All");
  const [activeCity, setActiveCity] = useState<CityKey>("atyrau");

  const localizedProjects = useMemo(
    () => getLocalizedProjects(locale),
    [locale],
  );

  const filteredProjects = useMemo(
    () => localizedProjects.filter(
      (project) => filter === "All" || project.category === filter,
    ),
    [filter, localizedProjects],
  );

  const cityProjects = filteredProjects.filter(
    (project) => getCityKey(project.location) === activeCity,
  );
  const activeCityName = CITIES.find((city) => city.key === activeCity)?.name ?? "Kazakhstan";

  const selectFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    const firstProject = localizedProjects.find(
      (project) => nextFilter === "All" || project.category === nextFilter,
    );
    const firstCity = getCityKey(firstProject?.location);
    if (firstCity) setActiveCity(firstCity);
  };

  return (
    <section id="project-map" className={styles.section} aria-labelledby="project-map-title">
      <header className={styles.header}>
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          <h2 id="project-map-title">{copy[1]}</h2>
        </div>
        <p>{copy[2]}</p>
      </header>

      <div
        className={styles.filters}
        aria-label={
          locale === "ru"
            ? "Фильтр карты по категории проекта"
            : locale === "tr"
              ? "Proje kategorisine göre harita filtresi"
              : locale === "kz"
                ? "Жоба санаты бойынша карта сүзгісі"
                : "Filter map by project category"
        }
      >
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            onClick={() => selectFilter(item)}
          >
            {copy[FILTERS.indexOf(item) + 3]}
          </button>
        ))}
      </div>

      <div className={styles.explorer}>
        <div
          className={styles.map}
          aria-label={
            locale === "ru"
              ? "Интерактивная карта проектов KAZENCO в Казахстане"
              : locale === "tr"
                ? "KAZENCO’nun Kazakistan’daki projelerinin etkileşimli haritası"
                : locale === "kz"
                  ? "KAZENCO-ның Қазақстандағы жобаларының интерактивті картасы"
                  : "Interactive map of KAZENCO project locations in Kazakhstan"
          }
        >
          <svg className={styles.country} viewBox="0 0 1000 520" aria-hidden="true">
            <defs>
              <linearGradient id="kazenco-map-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#17392f" />
                <stop offset="1" stopColor="#0b211b" />
              </linearGradient>
              <pattern id="kazenco-map-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,.055)" strokeWidth="1" />
              </pattern>
            </defs>
            <path
              className={styles.countryShape}
              d="M79 246 127 188 202 170 253 118 342 105 390 65 477 92 529 66 613 91 688 76 739 113 808 121 846 168 927 198 949 250 894 286 825 295 788 342 717 349 667 394 590 440 515 413 453 463 380 439 329 394 251 386 197 347 135 326Z"
            />
            <path
              className={styles.countryGrid}
              d="M79 246 127 188 202 170 253 118 342 105 390 65 477 92 529 66 613 91 688 76 739 113 808 121 846 168 927 198 949 250 894 286 825 295 788 342 717 349 667 394 590 440 515 413 453 463 380 439 329 394 251 386 197 347 135 326Z"
            />
            <path className={styles.route} d="M175 294 C230 270 245 313 273 334 M175 294 C360 270 575 340 792 405 M148 236 C166 255 170 274 175 294 M151 386 C150 350 160 319 175 294" />
          </svg>

          <div className={styles.mapLabel} aria-hidden="true">
            <span>{copy[8]}</span>
            <strong>{locale === "ru" ? "Казахстан" : locale === "kz" ? "Қазақстан" : locale === "tr" ? "Kazakistan" : "Kazakhstan"}</strong>
          </div>

          {CITIES.map((city) => {
            const count = filteredProjects.filter(
              (project) => getCityKey(project.location) === city.key,
            ).length;
            if (count === 0) return null;

            return (
              <button
                key={city.key}
                type="button"
                className={`${styles.marker} ${MARKER_CLASS[city.key]} ${activeCity === city.key ? styles.markerActive : ""}`}
                aria-pressed={activeCity === city.key}
                aria-controls="project-map-results"
                aria-label={`${city.name}: ${count} ${count === 1 ? copy[10] : copy[11]}`}
                onClick={() => setActiveCity(city.key)}
              >
                <span className={styles.markerCount}>{count}</span>
                <span className={styles.markerName}>{city.name}</span>
              </button>
            );
          })}
        </div>

        <aside id="project-map-results" className={styles.results} aria-live="polite">
          <div className={styles.resultsHeader}>
            <div>
              <span>{copy[9]}</span>
              <h3>{activeCityName}</h3>
            </div>
            <strong>{cityProjects.length.toString().padStart(2, "0")}</strong>
          </div>

          <div className={styles.projectList} key={`${filter}-${activeCity}`}>
            {cityProjects.map((project) => (
              <Link href={`/${locale}/projects/${project.slug}`} className={styles.project} key={project.slug}>
                <figure>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 800px) 28vw, 150px"
                    />
                  ) : (
                    <span aria-hidden="true">{project.title.slice(0, 1)}</span>
                  )}
                </figure>
                <div>
                  <span>{project.category}</span>
                  <h4>{project.title}</h4>
                  <p>{project.role}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <p className={styles.fallbackNote}>
        {copy[12]}
      </p>
    </section>
  );
}
