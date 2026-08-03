import { PROJECTS } from "@/lib/projects";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  ...PROJECTS.map((p) => ({
    label: p.title,
    href: `/project/${p.slug}`,
  })),
];

export function SiteNav() {
  return (
    <nav className="sr-only" aria-label="Site">
      <ul>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
