import { PROJECTS } from "@/lib/projects";
const NAV_LINKS = [{ label: "Home", href: "/" },{ label: "About", href: "/#about" },{ label: "Capabilities", href: "/#capabilities" },{ label: "Projects", href: "/#projects" },{ label: "Clients", href: "/#clients" },...PROJECTS.map((project)=>({ label: project.title, href: `/project/${project.slug}` }))];
export function SiteNav(){ return <nav className="sr-only" aria-label="Site"><ul>{NAV_LINKS.map((link)=><li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>; }
