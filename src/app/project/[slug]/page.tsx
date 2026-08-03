import { notFound } from "next/navigation";
import { ArrowUpRightIcon } from "@/components/icons";
import { BackButton } from "@/components/BackButton";
import { ProjectBullets } from "@/components/ProjectBullets";
import { SiteNav } from "@/components/SiteNav";
import { PROJECTS, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `Kazenco — ${project.title}` : "Kazenco" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const activeIndex = PROJECTS.findIndex((item) => item.slug === project.slug);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background lg:w-screen lg:overflow-hidden">
      <SiteNav />

      <BackButton className="absolute left-6 top-6 z-20 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background lg:left-10 lg:top-10" />

      <ProjectBullets
        projects={PROJECTS}
        activeIndex={activeIndex}
        className="fixed right-10 top-1/2 hidden -translate-y-1/2 lg:flex"
      />

      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col items-center justify-center gap-10 px-6 py-28 lg:px-8">
        <div
          className="aspect-[16/10] w-full overflow-hidden rounded-[32px] bg-cover bg-center"
          style={
            project.image
              ? { backgroundImage: `url(${project.image})` }
              : { background: project.gradient }
          }
        />

        <div className="flex w-full items-end justify-between gap-8 max-sm:flex-col max-sm:items-start">
          <div>
            <h1 className="m-0 text-[32px] font-normal leading-none text-foreground sm:text-[40px]">
              {project.title}
            </h1>
            <p className="mt-3 max-w-[440px] text-[18px] leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          </div>

          <div className="flex items-center gap-10">
            <dl className="m-0 text-sm">
              {project.category && (
                <>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="m-0 mb-3 text-foreground">
                    {project.category}
                  </dd>
                </>
              )}
              {project.location && (
                <>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="m-0 mb-3 text-foreground">
                    {project.location}
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">Scope</dt>
              <dd className="m-0 text-foreground">{project.role}</dd>
            </dl>

            <a
              href={project.externalUrl || "#"}
              aria-label="Open Project External Link"
              className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowUpRightIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
