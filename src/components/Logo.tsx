interface LogoProps { className?: string; title?: string; }
export function KazencoMark({ className, title = "KAZENCO" }: LogoProps) {
  return <img src="/images/misc/kazenco-logo.svg" alt={title} className={className} />;
}
