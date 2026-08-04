import type { ReactNode } from "react";
import Image from "next/image";

interface HeroStackProps {
  heroChildren: ReactNode;
}

export function HeroStack({ heroChildren }: HeroStackProps) {
  return (
    <div className="inc-stack">
      <section className="inc-hero">
        <Image
          className="inc-hero-image"
          src="/images/hero/kazenco-refinery-hero.jpg"
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="inc-hero-inner">
          {heroChildren}
        </div>
      </section>
    </div>
  );
}
