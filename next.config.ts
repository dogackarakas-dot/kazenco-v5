import type { NextConfig } from "next";

const isPreviewSite =
  process.env.KAZENCO_PREVIEW === "1" && process.env.VERCEL_ENV !== "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/en", permanent: true },
      { source: "/ing_cevre_pro.html", destination: "/en/capabilities/environmental-geosynthetic-works", permanent: true },
      { source: "/sertifikab2.html", destination: "/en#certificates", permanent: true },
      { source: "/sertifikab5.html", destination: "/en#certificates", permanent: true },
      { source: "/ing_ile.html", destination: "/en#contact", permanent: true },
      { source: "/rus_ile.html", destination: "/ru#contact", permanent: true },
      { source: "/ing_cozum_ortaklari.html", destination: "/en#clients", permanent: true },
      { source: "/ing_kur_kim.html", destination: "/en#about", permanent: true },
      { source: "/ing_istiraklerimiz.html", destination: "/en#about", permanent: true },
      { source: "/ing_mak_par.html", destination: "/en#capabilities", permanent: true },
      { source: "/ing_ref.html", destination: "/en#projects", permanent: true },
      { source: "/ing_pro-eski.html", destination: "/en#projects", permanent: true },
      { source: "/rus-index.html", destination: "/ru", permanent: true },
      { source: "/projects/:slug", destination: "/en/projects/:slug", permanent: true },
      { source: "/capabilities/:slug", destination: "/en/capabilities/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          ...(isPreviewSite
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
