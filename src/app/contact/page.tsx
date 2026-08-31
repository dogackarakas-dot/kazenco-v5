import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { KazencoContact } from "@/components/KazencoContact";
import { KazencoFooter } from "@/components/KazencoFooter";
import { PremiumHeader } from "@/components/PremiumHeader";
import { HOME_COPY } from "@/lib/home-translations";
import { isLocale, NAVIGATION } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";
import styles from "./contact.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";
  const pageTitle = NAVIGATION[locale].contact;
  const description = HOME_COPY[locale].contact.intro;
  const path = "/contact";
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!localeParam) permanentRedirect("/en/contact");
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;

  const pageUrl = `${SITE.url}/${locale}/contact`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: NAVIGATION[locale].home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: NAVIGATION[locale].contact, item: pageUrl },
    ],
  };
  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contact`,
    url: pageUrl,
    name: NAVIGATION[locale].contact,
    description: HOME_COPY[locale].contact.intro,
    about: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={contactPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PremiumHeader />
      <div className={styles.page}>
        <Link className={styles.back} href={`/${locale}#contact`}>
          ← {NAVIGATION[locale].home}
        </Link>
        <KazencoContact locale={locale} />
      </div>
      <KazencoFooter locale={locale} />
    </>
  );
}
