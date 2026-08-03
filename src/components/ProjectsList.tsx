"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types/project";

const PAGE_SIZE = 5;

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <>
      <ul>
        {visible.map((project) => (
          <li key={project.slug}>
            <p>{project.summary}</p>
            <div>
              <span>{project.location}</span>
              <span>{project.role}</span>
              <Link href={`/project/${project.slug}`}>View project</Link>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="inc-load-more">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, projects.length))}
            className="inc-button inc-button-more"
          >
            <span className="inc-button-text" aria-hidden="true">
              <span>Load more</span>
              <span>Load more</span>
              <span>Load more</span>
            </span>
            <span className="sr-only">Load more</span>
          </button>
        </div>
      )}
    </>
  );
}
