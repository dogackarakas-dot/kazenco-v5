export interface Project {
  slug: string;
  title: string;
  /** Fallback gradient shown in place of the real cover image. */
  gradient: string;
  /** Cover image path under /public; overrides the gradient when set. */
  image?: string;
  category?: "Fit-out & Furnishing" | "Construction" | "Material Supply" | "Assembly";
  location?: string;
  year?: string;
  role?: string;
  summary?: string;
  externalUrl?: string;
}
