import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KazencoHome } from "@/components/KazencoHome";
import { LOCALES, isLocale } from "@/lib/i18n";
import { localizedAlternates, SEO_COPY } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocalizedPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const seo = SEO_COPY[locale];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: `/${locale}`,
      languages: localizedAlternates(),
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: "KAZENCO",
      locale: locale === "kz" ? "kk_KZ" : `${locale}_${locale === "en" ? "GB" : locale === "ru" ? "KZ" : "TR"}`,
      title: seo.title,
      description: seo.description,
      images: [{ url: "/images/hero/kazenco-refinery-hero.jpg", width: 1672, height: 941, alt: "KAZENCO" }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: ["/images/hero/kazenco-refinery-hero.jpg"] },
  };
}

export default async function LocalizedHome({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <KazencoHome locale={locale} />;
}
