import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectBulletsProps {
  projects: Project[];
  activeIndex: number;
  onSelect?: (index: number) => void;
  className?: string;
}

export function ProjectBullets({
  projects,
  activeIndex,
  onSelect,
  className = "",
}: ProjectBulletsProps) {
  return (
    <ul
      className={`z-[60] m-0 list-none flex-col gap-2 p-0 ${className}`}
      aria-label="Project navigation"
    >
      {projects.map((project, index) => {
        const isActive = index === activeIndex;
        const dotClass = `block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
          isActive
            ? "scale-125 bg-foreground"
            : "bg-foreground/25 hover:bg-foreground/50"
        }`;

        return (
          <li key={`bullet-${project.slug}`}>
            {onSelect ? (
              <button
                type="button"
                aria-label={`Show ${project.title}`}
                onClick={() => onSelect(index)}
                className={dotClass}
              />
            ) : (
              <Link
                href={`/project/${project.slug}`}
                aria-label={`Open ${project.title}`}
                aria-current={isActive ? "page" : undefined}
                className={dotClass}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}