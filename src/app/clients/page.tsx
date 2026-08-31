import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoClients } from "@/components/KazencoClients";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { sectionCopy } from "@/lib/section-translations";
import { SITE } from "@/lib/site";
import styles from "./clients.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const pageTitle = sectionCopy(locale).clients[0];
  const description = sectionCopy(locale).clients[2];
  const path = "/clients";
  const canonical = `/${locale}${path}`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${pageTitle} | KAZENCO`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | KAZENCO`,
      description,
    },
  };
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/clients");
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;

  const pageUrl = `${SITE.url}/${locale}/clients`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].clients, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <div className={styles.page}>
        <Link className={styles.back} href={`/${locale}#clients`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <KazencoClients locale={locale} />
      </div>
      <KazencoFooter locale={locale} />
    </>
  );
}
