import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAZENCO | Engineering, Construction and Industrial Solutions",
  description:
    "KAZENCO provides engineering, construction, environmental, fit-out and industrial material supply solutions for civil and industrial projects across Kazakhstan.",
  icons: {
    icon: [{ url: "/seo/kazenco-icon.svg", type: "image/svg+xml" }],
    shortcut: "/seo/kazenco-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${manrope.variable}`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
