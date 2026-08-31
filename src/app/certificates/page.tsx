import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoCertificates } from "@/components/KazencoCertificates";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { sectionCopy } from "@/lib/section-translations";
import { SITE } from "@/lib/site";
import styles from "./certificates.module.css";

const PAGE_TITLE = {
  en: "Certificates & Quality Documentation",
  ru: "Сертификаты и документация по качеству",
  tr: "Sertifikalar ve Kalite Dokümantasyonu",
  kz: "Сертификаттар және сапа құжаттамасы",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const description = sectionCopy(locale).certificates[2];
  const path = "/certificates";
  const canonical = `/${locale}${path}`;
  return {
    title: PAGE_TITLE[locale],
    description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "KAZENCO",
      title: `${PAGE_TITLE[locale]} | KAZENCO`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE[locale]} | KAZENCO`,
      description,
    },
  };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/certificates");
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;

  const pageUrl = `${SITE.url}/${locale}/certificates`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].certificates, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <div className={styles.page}>
        <Link className={styles.back} href={`/${locale}#certificates`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <KazencoCertificates locale={locale} />
      </div>
      <KazencoFooter locale={locale} />
    </>
  );
}
