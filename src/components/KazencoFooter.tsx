import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";

export function KazencoFooter({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).footer;
  const home = `/${locale}`;
  return (
    <footer className="kazenco-v5-footer">
      <div className="kazenco-v5-footer-main">
        <div className="kazenco-v5-footer-brand">
          <Image
            src="/images/misc/kazenco-logo-approved.png"
            alt="KAZENCO"
            width={1604}
            height={385}
            sizes="(max-width: 700px) 80vw, 300px"
          />
          <p>{copy[0]}</p>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>{copy[1]}</h3>
          <Link href={`${home}#about`}>{copy[2]}</Link>
          <Link href={`${home}#projects`}>{copy[3]}</Link>
          <Link href={`${home}#clients`}>{copy[4]}</Link>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>{copy[5]}</h3>
          <Link href={`${home}#capabilities`}>{copy[6]}</Link>
          <Link href={`${home}#products`}>{copy[7]}</Link>
          <Link href={`${home}/industries`}>{copy[8]}</Link>
          <Link href={`${home}#project-map`}>{copy[9]}</Link>
          <Link href={`${home}/contact`}>{copy[10]}</Link>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>{copy[11]}</h3>
          <p>{copy[12]}</p>
          <p>{copy[13]}</p>
        </div>
      </div>

      <div className="inc-footer">
        <p className="m-0">© {new Date().getFullYear()} KAZENCO. {copy[14]}</p>
        <a
          href="https://fibilisim.com.tr/"
          target="_blank"
          rel="noreferrer"
          className="inc-footer-credit"
        >
          <span>{copy[15]}</span>
          <Image src="/images/misc/developed-by.ico" alt="Fi Bilişim" width={18} height={18} />
        </a>
      </div>
    </footer>
  );
}
