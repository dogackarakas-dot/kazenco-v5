import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import styles from "./KazencoCertificates.module.css";

type DocumentStatus = "active" | "record" | "historical" | "reference";

interface CertificateDocument {
  category: "Corporate records" | "Quality management" | "Manufacturer documents";
  issuer: string;
  title: string;
  href: string;
  preview: string;
  status: DocumentStatus;
  statusLabel: string;
  validity: string;
  designedCover?: boolean;
}

const CERTIFICATES: CertificateDocument[] = [
  {
    category: "Corporate records",
    issuer: "Ministry of Justice · Kazakhstan",
    title: "Certificate of Incorporation",
    href: "/certificates/kazenco-certificate-of-incorporation.pdf",
    preview: "/certificates/kazenco-certificate-of-incorporation-preview.png",
    status: "record",
    statusLabel: "Corporate record",
    validity: "Re-registered 23 Jun 2010",
  },
  {
    category: "Corporate records",
    issuer: "State Revenue Department · Atyrau",
    title: "VAT Registration Certificate",
    href: "/certificates/kazenco-vat-certificate.pdf",
    preview: "/certificates/kazenco-vat-certificate-preview.png",
    status: "record",
    statusLabel: "Corporate record",
    validity: "Registered since 1 Jun 2004",
  },
  {
    category: "Corporate records",
    issuer: "Jusan Bank",
    title: "Company Data Details",
    href: "/certificates/data-details-kazenco-jusan-bank.pdf",
    preview: "/certificates/data-details-kazenco-jusan-bank-preview.png",
    status: "record",
    statusLabel: "Corporate record",
    validity: "Company information document",
    designedCover: true,
  },
  {
    category: "Quality management",
    issuer: "Batys Cert",
    title: "ISO 9001:2015 Certificate of Conformity",
    href: "/certificates/kazenco-kzq-certificate.pdf",
    preview: "/certificates/kazenco-kzq-certificate-preview.png",
    status: "active",
    statusLabel: "Valid",
    validity: "Valid until 18 Jan 2027",
  },
  {
    category: "Quality management",
    issuer: "Kazakhstan Technical Regulation System",
    title: "ISO 9001:2008 Certificate",
    href: "/certificates/kazenco-iso-certificate.pdf",
    preview: "/certificates/kazenco-iso-certificate-preview.png",
    status: "historical",
    statusLabel: "Historical",
    validity: "Valid 2016–2019",
  },
  {
    category: "Manufacturer documents",
    issuer: "Prysmian",
    title: "Cable Reseller Authorization",
    href: "/certificates/kazenco-2026-authorization.pdf",
    preview: "/certificates/kazenco-2026-authorization-preview.png",
    status: "active",
    statusLabel: "Current authorization",
    validity: "Issued 7 Apr 2026 · 1 year",
  },
  {
    category: "Manufacturer documents",
    issuer: "Prysmian",
    title: "Cable Reseller Authorization",
    href: "/certificates/llp-kazenco-authorization-prysmian.pdf",
    preview: "/certificates/llp-kazenco-authorization-prysmian-preview.png",
    status: "historical",
    statusLabel: "Historical",
    validity: "Issued 30 Apr 2024 · 1 year",
  },
  {
    category: "Manufacturer documents",
    issuer: "ABB · Elmat KZ",
    title: "Dealer Authorization Certificate",
    href: "/certificates/elmat-kz-abb.pdf",
    preview: "/certificates/elmat-kz-abb-preview.png",
    status: "historical",
    statusLabel: "Historical",
    validity: "Valid during 2024",
  },
  {
    category: "Manufacturer documents",
    issuer: "Mennekes",
    title: "Authorized Distributor Certificate",
    href: "/certificates/mennekes.pdf",
    preview: "/certificates/mennekes-preview.png",
    status: "historical",
    statusLabel: "Historical",
    validity: "Valid until 31 Dec 2024",
  },
  {
    category: "Manufacturer documents",
    issuer: "İzeltaş",
    title: "Commercial Reference Letter",
    href: "/certificates/izeltas.pdf",
    preview: "/certificates/izeltas-preview.png",
    status: "reference",
    statusLabel: "Reference letter",
    validity: "Issued 10 May 2024",
  },
];

const GROUPS = [
  {
    name: "Corporate records" as const,
    description: "Registration, tax and company-information documents.",
  },
  {
    name: "Quality management" as const,
    description: "Current and historical quality-management conformity records.",
  },
  {
    name: "Manufacturer documents" as const,
    description: "Authorization certificates and commercial reference documents, with dates shown transparently.",
  },
];

const CERTIFICATE_COPY: Record<Locale, Array<[string, string]>> = {
  en: CERTIFICATES.map(({ statusLabel, validity }) => [statusLabel, validity]),
  ru: [
    ["Корпоративный документ", "Перерегистрация: 23 июня 2010 г."],
    ["Корпоративный документ", "Зарегистрировано с 1 июня 2004 г."],
    ["Корпоративный документ", "Информационный документ компании"],
    ["Действует", "Действителен до 18 января 2027 г."],
    ["Архивный", "Действовал в 2016–2019 гг."],
    ["Действующая авторизация", "Выдан 7 апреля 2026 г. · 1 год"],
    ["Архивный", "Выдан 30 апреля 2024 г. · 1 год"],
    ["Архивный", "Действовал в течение 2024 г."],
    ["Архивный", "Действовал до 31 декабря 2024 г."],
    ["Рекомендательное письмо", "Выдано 10 мая 2024 г."],
  ],
  tr: [
    ["Kurumsal kayıt", "23 Haziran 2010’da yeniden tescil edildi"],
    ["Kurumsal kayıt", "1 Haziran 2004’ten beri kayıtlı"],
    ["Kurumsal kayıt", "Şirket bilgi belgesi"],
    ["Geçerli", "18 Ocak 2027’ye kadar geçerli"],
    ["Geçmiş belge", "2016–2019 döneminde geçerliydi"],
    ["Güncel yetki", "7 Nisan 2026’da düzenlendi · 1 yıl"],
    ["Geçmiş belge", "30 Nisan 2024’te düzenlendi · 1 yıl"],
    ["Geçmiş belge", "2024 yılı boyunca geçerliydi"],
    ["Geçmiş belge", "31 Aralık 2024’e kadar geçerliydi"],
    ["Referans mektubu", "10 Mayıs 2024’te düzenlendi"],
  ],
  kz: [
    ["Корпоративтік құжат", "2010 жылғы 23 маусымда қайта тіркелген"],
    ["Корпоративтік құжат", "2004 жылғы 1 маусымнан бері тіркелген"],
    ["Корпоративтік құжат", "Компания туралы ақпараттық құжат"],
    ["Қолданыста", "2027 жылғы 18 қаңтарға дейін жарамды"],
    ["Тарихи", "2016–2019 жылдары жарамды болды"],
    ["Қолданыстағы өкілеттік", "2026 жылғы 7 сәуірде берілген · 1 жыл"],
    ["Тарихи", "2024 жылғы 30 сәуірде берілген · 1 жыл"],
    ["Тарихи", "2024 жыл бойы жарамды болды"],
    ["Тарихи", "2024 жылғы 31 желтоқсанға дейін жарамды болды"],
    ["Ұсыным хат", "2024 жылғы 10 мамырда берілген"],
  ],
};

const DOCUMENT_COVER_COPY: Record<Locale, [string, string, string]> = {
  en: ["Corporate document", "Company Data Details", "Verified record · PDF"],
  ru: ["Корпоративный документ", "Сведения о компании", "Подтверждённый документ · PDF"],
  tr: ["Kurumsal belge", "Şirket Bilgileri", "Doğrulanmış kayıt · PDF"],
  kz: ["Корпоративтік құжат", "Компания деректері", "Расталған құжат · PDF"],
};

export function KazencoCertificates({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).certificates;
  const groupCopy = [[copy[4], copy[5]], [copy[6], copy[7]], [copy[8], copy[9]]];
  const certificateCopy = CERTIFICATE_COPY[locale];
  const documentCoverCopy = DOCUMENT_COVER_COPY[locale];
  return (
    <section id="certificates" className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          {copy[1] ? <h2>{copy[1]}</h2> : null}
        </div>
        <p>{copy[2]}</p>
      </header>

      <div className={styles.groups}>
        {GROUPS.map((group, groupIndex) => (
          <section className={styles.group} key={group.name} aria-labelledby={`documents-${group.name.replaceAll(" ", "-")}`}>
            <header className={styles.groupHeader}>
              <h3 id={`documents-${group.name.replaceAll(" ", "-")}`}>{groupCopy[groupIndex][0]}</h3>
              <p>{groupCopy[groupIndex][1]}</p>
            </header>
            <div className={styles.grid}>
              {CERTIFICATES.filter((certificate) => certificate.category === group.name).map((certificate) => {
                const index = CERTIFICATES.indexOf(certificate);
                return (
                  <Link
                    href={certificate.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.card}
                    key={certificate.href}
                  >
                    <div className={styles.preview}>
                      {certificate.designedCover ? (
                        <div className={styles.documentCover}>
                          <span className={styles.documentBrand}>JUSAN BANK</span>
                          <div>
                            <small>{documentCoverCopy[0]}</small>
                            <strong>{documentCoverCopy[1]}</strong>
                          </div>
                          <span className={styles.documentStatus}>{documentCoverCopy[2]}</span>
                        </div>
                      ) : (
                        <Image
                          src={certificate.preview}
                          alt={`${certificate.issuer} ${certificate.title} preview`}
                          fill
                          sizes="(max-width: 580px) 100vw, (max-width: 850px) 50vw, 33vw"
                        />
                      )}
                      <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={`${styles.status} ${styles[certificate.status]}`}>{certificateCopy[index][0]}</span>
                    </div>
                    <div className={styles.content}>
                      <p>{certificate.issuer}</p>
                      <h3>{certificate.title}</h3>
                      <span className={styles.validity}>{certificateCopy[index][1]}</span>
                      <span className={styles.open}>{copy[3]} ↗</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
