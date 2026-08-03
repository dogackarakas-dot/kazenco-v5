interface LogoProps {
  className?: string;
  title?: string;
}

const GREEN = "#1a8a1a";
const RED = "#ec1c24";

/** Kazenco emblem — green diamond frame with a red diamond and base bar. */
export function KazencoMark({ className, title = "Kazenco" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 210"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green diamond frame that opens into two legs */}
      <path
        d="M100 26 L38 86 L86 138 L86 172"
        stroke={GREEN}
        strokeWidth="18"
        strokeLinejoin="miter"
      />
      <path
        d="M100 26 L162 86 L114 138 L114 172"
        stroke={GREEN}
        strokeWidth="18"
        strokeLinejoin="miter"
      />
      {/* Red inner diamond */}
      <polygon points="100,54 66,88 100,122 134,88" fill={RED} />
      {/* Red base bar */}
      <rect x="62" y="182" width="76" height="13" fill={RED} />
    </svg>
  );
}
