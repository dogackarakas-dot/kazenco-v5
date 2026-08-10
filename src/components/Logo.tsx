import Image from "next/image";

interface LogoProps { className?: string; title?: string; }
export function KazencoMark({ className, title = "KAZENCO" }: LogoProps) {
  return (
    <Image
      src="/images/misc/kazenco-logo-approved.png"
      alt={title}
      width={1754}
      height={897}
      sizes="(max-width: 680px) 180px, 220px"
      className={className}
      preload
    />
  );
}
