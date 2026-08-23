import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";
import { DocumentLocale } from "@/components/DocumentLocale";
import { SITE } from "@/lib/site";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "KAZENCO | Engineering, Construction and Industrial Solutions",
    template: "%s | KAZENCO",
  },
  description:
    "KAZENCO provides engineering, construction, environmental, fit-out and industrial material supply solutions for civil and industrial projects across Kazakhstan.",
  alternates: {
    canonical: "/en",
    languages: { en: "/en", ru: "/ru", tr: "/tr", kk: "/kz", "x-default": "/en" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: "KAZENCO | Engineering, Construction and Industrial Solutions",
    description:
      "Engineering, construction, environmental, fit-out and industrial material supply solutions across Kazakhstan.",
    images: [
      {
        url: "/images/hero/kazenco-refinery-hero.jpg",
        width: 1672,
        height: 941,
        alt: "KAZENCO industrial project delivery in Kazakhstan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAZENCO | Engineering, Construction and Industrial Solutions",
    description:
      "Engineering, construction, fit-out and industrial supply solutions across Kazakhstan.",
    images: ["/images/hero/kazenco-refinery-hero.jpg"],
  },
  icons: {
    icon: [{ url: "/seo/kazenco-icon-approved.png", type: "image/png" }],
    shortcut: "/seo/kazenco-icon-approved.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/misc/kazenco-logo-approved.png`,
    foundingDate: "2004",
    email: SITE.email,
    telephone: SITE.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.streetAddress,
      addressLocality: SITE.cityName,
      postalCode: SITE.postalCode,
      addressCountry: SITE.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: "Kazakhstan",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`h-full antialiased ${manrope.variable}`}>
      <body className="min-h-full bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.lang=({en:'en',ru:'ru',tr:'tr',kz:'kk'}[location.pathname.split('/')[1]]||'en')",
          }}
        />
        <DocumentLocale />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
