import { permanentRedirect } from "next/navigation";
import { PROJECTS } from "@/lib/projects";

export default async function LegacyProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!PROJECTS.some((project) => project.slug === slug)) {
    permanentRedirect("/en");
  }
  permanentRedirect(`/en/projects/${slug}`);
}
