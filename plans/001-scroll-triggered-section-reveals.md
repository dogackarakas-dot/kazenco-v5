# 001 — Make hero-below homepage sections reveal on scroll

- **Status**: TODO
- **Commit**: ae63021
- **Severity**: MEDIUM
- **Category**: Missed opportunities / Cohesion & tokens
- **Estimated scope**: 1 new hook file, 1 new component file, 7 existing component edits, 1 CSS file (2 additions)

## Problem

The homepage has exactly one working scroll-motion system: `.kazenco-v7-reveal` in `src/app/globals.css:2523-2542`, used only inside `src/components/KazencoHeroContent.tsx` (lines 123, 128-130, 133, 137, 155, 161). It plays automatically on mount via CSS `animation: ... forwards` — there is no `IntersectionObserver` gating it, which is correct for a hero (always in the first viewport) but means the same visual language never reaches anything below it.

Every other homepage section renders its heading and card grid with no entrance transition at all — content is simply present the instant it enters the viewport during scroll. Confirmed empty for these files (`grep -c "IntersectionObserver"` = 0 in each):

- `src/components/KazencoCapabilities.tsx`
- `src/components/KazencoProducts.tsx`
- `src/components/KazencoIndustries.tsx`
- `src/components/KazencoCertificatesSummary.tsx`
- `src/components/KazencoClientsSummary.tsx`
- `src/components/KazencoContact.tsx`
- the inline FAQ block in `src/components/KazencoHome.tsx:54-75`

Current keyframe and delay tokens (do not change these — reuse them):

```css
/* src/app/globals.css:2523-2537 — current, DO NOT MODIFY */
.kazenco-v7-reveal {
  opacity: 0;
  transform: translateY(30px);
  animation: kazenco-v7-reveal 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.kazenco-v7-delay-1 { animation-delay: 80ms; }
.kazenco-v7-delay-2 { animation-delay: 170ms; }
.kazenco-v7-delay-3 { animation-delay: 260ms; }
.kazenco-v7-delay-4 { animation-delay: 350ms; }
.kazenco-v7-delay-5 { animation-delay: 470ms; }
.kazenco-v7-delay-6 { animation-delay: 570ms; }
.kazenco-v7-delay-7 { animation-delay: 680ms; }
.kazenco-v7-delay-8 { animation-delay: 780ms; }

@keyframes kazenco-v7-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

```css
/* src/app/globals.css:2624-2634 — current, DO NOT MODIFY (extend it, see Target) */
@media (prefers-reduced-motion: reduce) {
  .kazenco-v7-reveal,
  .kazenco-v7-scroll-cue span::after {
    animation: none;
  }

  .kazenco-v7-reveal {
    opacity: 1;
    transform: none;
  }
}
```

## Target

Do **not** touch `.kazenco-v7-reveal` or its usage in `KazencoHeroContent.tsx` — the hero's on-mount behavior must stay exactly as it is today. Instead add a second, scroll-gated variant that reuses the identical keyframe, duration, easing and delay classes.

```css
/* NEW — add directly after the existing .kazenco-v7-reveal block (after line 2537, before the @keyframes block at 2538) */

.kazenco-v7-reveal-onscroll {
  opacity: 0;
  transform: translateY(30px);
}

.kazenco-v7-reveal-onscroll.kazenco-v7-in-view,
.kazenco-v7-in-view > .kazenco-v7-reveal-onscroll {
  animation: kazenco-v7-reveal 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

The two selectors cover both usages in this plan:
- `.kazenco-v7-reveal-onscroll.kazenco-v7-in-view` — a single element (a section-head) carries both classes itself once visible.
- `.kazenco-v7-in-view > .kazenco-v7-reveal-onscroll` — a grid wrapper gets `.kazenco-v7-in-view` from the observer; its direct-child cards (which already carry `.kazenco-v7-reveal-onscroll` in JSX) animate together, staggered only by their existing `.kazenco-v7-delay-N` class.

Extend the reduced-motion block (edit the existing block, add `.kazenco-v7-reveal-onscroll` everywhere `.kazenco-v7-reveal` appears):

```css
/* target — src/app/globals.css:2624-2634 replacement */
@media (prefers-reduced-motion: reduce) {
  .kazenco-v7-reveal,
  .kazenco-v7-reveal-onscroll,
  .kazenco-v7-scroll-cue span::after {
    animation: none;
  }

  .kazenco-v7-reveal,
  .kazenco-v7-reveal-onscroll {
    opacity: 1;
    transform: none;
  }
}
```

This matches the existing convention for this token exactly (full removal, not a gentler fade) — `.kazenco-v7-reveal` already does this for the hero, so `.kazenco-v7-reveal-onscroll` follows the same settled choice rather than introducing an inconsistent reduced-motion treatment for the same visual system.

New hook, `src/hooks/useScrollReveal.ts` (new file — `src/hooks/` currently only contains `.gitkeep`):

```ts
"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `kazenco-v7-in-view` to the returned ref's element the first time it
 * scrolls into the viewport, then disconnects. Pair with the
 * `.kazenco-v7-reveal-onscroll` CSS class (see globals.css) on the same
 * element (single reveal) or on its direct children (staggered grid reveal).
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      element.classList.add("kazenco-v7-in-view");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          element.classList.add("kazenco-v7-in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

## Repo conventions to follow

- Client-only hooks belong in `src/hooks/`; this is the first file in that directory (currently only `.gitkeep`).
- Reuse `.kazenco-v7-delay-1` through `.kazenco-v7-delay-8` verbatim (`src/app/globals.css:2529-2536`) — every grid in this plan has 8 or fewer items, so `index + 1` (1-indexed, no modulo) always resolves to an existing delay class. Do not invent new delay values.
- Exemplar for the "always-composed section component" pattern to imitate for the new `KazencoFaq.tsx`: `src/components/KazencoCertificatesSummary.tsx` (small, locale-driven, default-exported as a named export, takes `{ locale }: { locale?: Locale }`).
- `KazencoClientsSummary.tsx` is already `"use client"` — leave its directive alone, just add the hook import and refs.

## Steps

1. **Create `src/hooks/useScrollReveal.ts`** with the exact content in Target above.

2. **`src/app/globals.css`** — two edits:
   - After line 2537 (the closing `}` of `.kazenco-v7-reveal`) and before line 2538 (`@keyframes kazenco-v7-reveal {`), insert the new `.kazenco-v7-reveal-onscroll` block from Target.
   - Replace the `@media (prefers-reduced-motion: reduce)` block currently at lines 2624-2634 with the extended version from Target.

3. **`src/components/KazencoCapabilities.tsx`**
   - Add `"use client";` as the first line, blank line after it.
   - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";` to the import block.
   - Inside the component body, after the existing `const capabilities = ...` line, add:
     ```ts
     const headRef = useScrollReveal<HTMLElement>();
     const gridRef = useScrollReveal<HTMLDivElement>();
     ```
   - On `<header className="kazenco-capabilities-head">`, add `ref={headRef}` and append `kazenco-v7-reveal-onscroll` to the className: `className="kazenco-capabilities-head kazenco-v7-reveal-onscroll"`.
   - On `<div className="kazenco-capabilities-grid">`, add `ref={gridRef}`.
   - Change `{capabilities.map((capability) => (` to `{capabilities.map((capability, index) => (` and update the `<article>`'s className from `"kazenco-capability-card"` to:
     ```tsx
     className={`kazenco-capability-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
     ```
   - Leave every other line (scope list, Link, copy) untouched.

4. **`src/components/KazencoProducts.tsx`**
   - Add `"use client";` as the first line, blank line after it.
   - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";`.
   - After `const referenceLabels = ...`, add:
     ```ts
     const headRef = useScrollReveal<HTMLDivElement>();
     const gridRef = useScrollReveal<HTMLDivElement>();
     ```
   - On `<div className="kazenco-v5-section-head">` (the first one, line 37 — NOT the one inside `.kazenco-product-references-head`), add `ref={headRef}` and append the class: `className="kazenco-v5-section-head kazenco-v7-reveal-onscroll"`.
   - On `<div className="kazenco-v9-product-grid">`, add `ref={gridRef}`.
   - Change `{PRODUCTS.map((product, index) => {` — index already exists here, no change needed to the map signature.
   - On the `<article>` inside that map, change:
     ```tsx
     className={`kazenco-v9-product-card${index === 0 ? " is-featured" : ""}`}
     ```
     to:
     ```tsx
     className={`kazenco-v9-product-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}${index === 0 ? " is-featured" : ""}`}
     ```
   - Do NOT touch `.kazenco-product-references-head` or `.kazenco-product-reference-grid` — out of scope (see Boundaries).

5. **`src/components/KazencoIndustries.tsx`**
   - Add `"use client";` as the first line, blank line after it.
   - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";`.
   - After `const industries = ...`, add:
     ```ts
     const headRef = useScrollReveal<HTMLDivElement>();
     const gridRef = useScrollReveal<HTMLDivElement>();
     ```
   - On `<div className="kazenco-v5-section-head">` (line 11), add `ref={headRef}` and append the class.
   - On `<div className="kazenco-v5-industry-grid">` (line 21), add `ref={gridRef}`.
   - Change `{industries.slice(0, 3).map((industry) => (` to `{industries.slice(0, 3).map((industry, index) => (`.
   - On the `<Link className="kazenco-v5-industry-card" ...>`, append the reveal classes:
     ```tsx
     className={`kazenco-v5-industry-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
     ```

6. **`src/components/KazencoCertificatesSummary.tsx`** (no grid — head only)
   - Add `"use client";` as the first line, blank line after it.
   - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";`.
   - After `const copy = ...`, add: `const headRef = useScrollReveal<HTMLDivElement>();`
   - On `<div className="kazenco-v5-section-head">` (line 9), add `ref={headRef}` and append the class.
   - Do not add a grid ref — this component has no card list.

7. **`src/components/KazencoClientsSummary.tsx`** (already `"use client"`)
   - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";` to the existing import block.
   - After `const copy = ...`, add:
     ```ts
     const headRef = useScrollReveal<HTMLDivElement>();
     const gridRef = useScrollReveal<HTMLDivElement>();
     ```
   - On `<div className="kazenco-v5-section-head">` (line 13), add `ref={headRef}` and append the class.
   - On `<div className="kazenco-v5-client-grid">` (line 21), add `ref={gridRef}`.
   - Change `{CLIENTS.slice(0, 8).map((client) => (` to `{CLIENTS.slice(0, 8).map((client, index) => (`.
   - On `<div className="kazenco-v5-client-card" key={client.name}>`, change to:
     ```tsx
     className={`kazenco-v5-client-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
     ```

8. **Create `src/components/KazencoFaq.tsx`** (new file, extracted from the inline block currently in `KazencoHome.tsx:54-75`):

   ```tsx
   "use client";

   import { DeferredContactModal } from "@/components/DeferredContactModal";
   import { HOME_COPY } from "@/lib/home-translations";
   import type { Locale } from "@/lib/i18n";
   import { useScrollReveal } from "@/hooks/useScrollReveal";

   export function KazencoFaq({ locale = "en" }: { locale?: Locale }) {
     const copy = HOME_COPY[locale];
     const headRef = useScrollReveal<HTMLDivElement>();
     const listRef = useScrollReveal<HTMLDivElement>();
     return (
       <section className="inc-section inc-faq">
         <div ref={headRef} className="kazenco-v7-reveal-onscroll">
           <p className="kazenco-section-kicker">{copy.faq.kicker}</p>
           <h2>{copy.faq.title}</h2>
           <p>
             {copy.faq.intro}{" "}
             <DeferredContactModal
               triggerClassName="cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"
               triggerLabel={copy.faq.contact}
             />
           </p>
         </div>

         <div ref={listRef} className="inc-faq-list">
           {copy.faq.items.map(([question, answer], index) => (
             <details
               key={question}
               className={`kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
             >
               <summary>{question}</summary>
               <p>{answer}</p>
             </details>
           ))}
         </div>
       </section>
     );
   }
   ```

9. **`src/components/KazencoHome.tsx`**
   - Add `import { KazencoFaq } from "@/components/KazencoFaq";` to the import block (alphabetically, after `KazencoFooter`).
   - Remove the `import { DeferredContactModal } from "@/components/DeferredContactModal";` line at the top — after step 8, it is no longer used anywhere else in this file. (Verify with `grep -n "DeferredContactModal" src/components/KazencoHome.tsx` before removing — if it still finds a usage outside the block you are about to delete, STOP and report instead of removing the import.)
   - Replace the entire block from `<section className="inc-section inc-faq">` (line 54) through its matching `</section>` (line 75) with:
     ```tsx
     <KazencoFaq locale={locale} />
     ```

10. **`src/components/KazencoContact.tsx`**
    - Add `"use client";` as the first line, blank line after it.
    - Add `import { useScrollReveal } from "@/hooks/useScrollReveal";`.
    - After `const details = [...]`, add:
      ```ts
      const headRef = useScrollReveal<HTMLDivElement>();
      const detailsRef = useScrollReveal<HTMLDivElement>();
      ```
    - On `<div className="kazenco-contact-heading">` (line 22), add `ref={headRef}` and append the class: `className="kazenco-contact-heading kazenco-v7-reveal-onscroll"`.
    - On `<div className="kazenco-contact-details">` (line 31), add `ref={detailsRef}`.
    - Change `{details.map((detail) => (` to `{details.map((detail, index) => (`.
    - On `<article key={detail.label}>`, add:
      ```tsx
      className={`kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
      ```

## Boundaries

- Do NOT modify `.kazenco-v7-reveal`, its delay classes' values, the `@keyframes kazenco-v7-reveal` block, or anything in `KazencoHeroContent.tsx`.
- Do NOT touch `.kazenco-product-references-head` / `.kazenco-product-reference-grid` in `KazencoProducts.tsx` — the secondary photo gallery is out of scope for this plan.
- Do NOT touch `KazencoAbout.tsx`, `KazencoWhy.tsx`, `KazencoProjectMap.tsx`, or `KazencoV12Portfolio.tsx` — not part of this plan's named section list.
- Do NOT add a new easing/duration token — this plan exists specifically to reuse `850ms cubic-bezier(0.16, 1, 0.3, 1)`, not to introduce a second one.
- Do NOT change any component's markup structure, copy, or non-motion classNames — only add `ref`, append reveal/delay classNames, add the `"use client"` directive, and add the hook import/call.
- If any step's "current code" excerpt doesn't match what you find in the file (drift since commit `ae63021`), STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` — expect zero errors.
  - `npm run build` — expect exit 0, all routes generated (58 routes as of commit `ae63021`).
- **Feel check** — run `npm run start`, open `/en` in a real browser at normal scroll speed:
  - Scroll from the hero down to Capabilities: the kicker+heading fades/rises in once as the section enters view, then — slightly staggered, ~90ms apart per card — the 4 capability cards do the same. They should NOT all be already visible before you reach them (confirms the observer is gating correctly, not firing on mount).
  - Repeat for Products (7 cards), Industries (3 cards), Clients (8 logos), FAQ (4 questions), Contact (3 detail articles) — each section's grid should stagger, each section-head should reveal once as it enters.
  - Certificates section: only the kicker+heading should animate — there is no grid here, confirm nothing else moves.
  - Scroll back up past a section, then back down again: the section must NOT re-animate (the observer disconnects after the first trigger — this is intentional, do not "fix" it to repeat).
  - In DevTools → Rendering panel, enable "Emulate CSS media feature prefers-reduced-motion: reduce", hard-reload `/en`, and scroll through the same sections: every section's content must be visible immediately with no movement and no fade-in delay (opacity 1, no transform) — nothing should stay invisible.
  - Confirm the hero's own reveal (title, stats, trusted-by row) is unchanged from before this plan — it should still play immediately on load, not wait for scroll.
- **Done when**: all six mechanical/feel checks above pass, `git diff --stat` shows only the files listed in Steps 1-10, and no console errors appear in the browser during scroll.
