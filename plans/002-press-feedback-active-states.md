# 002 — Add press feedback (`:active`) to primary buttons and clickable cards

- **Status**: TODO
- **Commit**: ae63021
- **Severity**: LOW
- **Category**: Physicality & origin / Missed opportunities
- **Estimated scope**: 1 CSS file, ~6 selector additions, 0 component/markup changes

## Problem

`src/app/globals.css` has 28 `:hover` rules and **zero** `:active` rules (`grep -c ":active" src/app/globals.css` → 0). Every pressable button and card in the product has a hover transition but no distinct feedback for the moment of the actual press — the interface confirms "you're pointing at something" but never "the interface registered your click."

Six selectors are in scope: real buttons, and cards where the whole element is the clickable target (a `<Link>`/`<a>` wraps it) or is designed as a single interactive unit with an existing hover-lift (confirmed real DOM usage via `grep -rl` before including each one below — two lookalike classes, `.kazenco-v5-product-card` and `.kazenco-product-card`, are defined in CSS but have zero matches in any `.tsx` file and are excluded as dead code).

```css
/* src/app/globals.css:465-484 — current */
.kazenco-hero-primary,
.kazenco-hero-secondary {
  display: inline-flex;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 25px;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
}
.kazenco-hero-primary { border: 1px solid #d3171f; background: #d3171f; color: #fff; }
.kazenco-hero-secondary { border: 1px solid rgba(255,255,255,.40); background: rgba(255,255,255,.08); color: #fff; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.kazenco-hero-primary:hover,
.kazenco-hero-secondary:hover { transform: translateY(-2px); }
.kazenco-hero-secondary:hover { border-color: #fff; background: rgba(255,255,255,.15); }
```

```css
/* src/app/globals.css:1905-1928 — current */
.kazenco-catalog-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 999px;
  padding: 0.95rem 1.6rem;
  /* ...unlisted declarations unchanged... */
}
.kazenco-catalog-button span {
  font-size: 1rem;
  line-height: 1;
}
.kazenco-catalog-button:hover {
  transform: translateY(-2px);
}
```

```css
/* src/app/globals.css:308-329 — current */
.inc-button {
  position: relative;
  display: inline-grid;
  min-width: 0;
  width: var(--button-width, 9rem);
  height: 2.25rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--foreground);
  border-radius: 999px;
  background: var(--foreground);
  color: var(--background);
  padding: 0;
  font-family: var(--font-clone-mono);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}
```
`.inc-button` has no dedicated `:hover` of its own (only `.inc-button:hover .inc-button-text` slides an inner text layer — a separate mechanism on a child element, untouched by this plan).

```css
/* src/app/globals.css:2049-2064 — current */
.kazenco-v5-industry-card {
  display: block;
  min-height: 210px;
  border-radius: 24px;
  padding: 22px;
  color: #ffffff;
  text-decoration: none;
  background:
    linear-gradient(135deg, rgba(7, 19, 29, 0.96), rgba(7, 19, 29, 0.70)),
    radial-gradient(circle at 90% 10%, rgba(236, 28, 36, 0.30), transparent 34%);
  transition: transform 180ms ease;
}

.kazenco-v5-industry-card:hover {
  transform: translateY(-2px);
}
```

```css
/* src/app/globals.css:2799-2822 — current */
.kazenco-v9-product-card {
  position: relative;
  grid-column: span 4;
  min-height: 430px;
  overflow: hidden;
  border: 1px solid rgba(43, 43, 43, 0.10);
  border-radius: 30px;
  padding: 26px;
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(246, 247, 247, 0.92));
  color: inherit;
  text-decoration: none;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  transition:
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 300ms ease,
    border-color 300ms ease;
}

.kazenco-v9-product-card.is-featured {
  grid-column: span 8;
}

.kazenco-v9-product-card:hover {
  transform: translateY(-7px);
  border-color: rgba(24, 128, 25, 0.24);
  box-shadow: 0 30px 80px rgba(16, 35, 48, 0.13);
  /* ...unlisted declarations unchanged... */
}
```

## Target

Per AUDIT.md §3 (Physicality & origin): "Press feedback: `transform: scale(0.97)` on `:active` with `transition: transform 160ms ease-out`. Keep it subtle (0.95–0.98)." The user has specified `scale(0.98)` / `140ms ease-out` for this plan — within that documented range, use these exact values everywhere in this plan (do not vary them per element):

```css
/* target — six new rules, one per selector, added immediately after each
   selector's existing :hover rule (see Steps for exact insertion points) */

.kazenco-hero-primary:active,
.kazenco-hero-secondary:active {
  transform: scale(0.98);
  transition: transform 140ms ease-out;
}

.kazenco-catalog-button:active {
  transform: scale(0.98);
  transition: transform 140ms ease-out;
}

.inc-button:active {
  transform: scale(0.98);
  transition: transform 140ms ease-out;
}

.kazenco-v5-industry-card:active {
  transform: scale(0.98);
  transition: transform 140ms ease-out;
}

.kazenco-v9-product-card:active {
  transform: scale(0.98);
  transition: transform 140ms ease-out;
}
```

Note `.kazenco-hero-primary` and `.kazenco-hero-secondary` share one rule (they already share their base and hover rules the same way — follow that existing pattern instead of writing two near-identical blocks).

This is additive only: every existing `:hover` rule (`translateY(-2px)`, `translateY(-7px)`, box-shadow, border-color, background-color changes) stays exactly as it is. `:active` fires only during the mousedown/touch-hold window and its `transform` simply overrides the hover's `transform` for that instant — both transitions are cheap (`transform`-only, well under the 300ms UI budget, actually 140ms which is inside the documented 100-160ms "button press feedback" range from AUDIT.md §2).

## Repo conventions to follow

- Every existing motion rule in this file pairs a `transition` declaration directly on the property changing; this plan follows the same one-declaration-per-rule style rather than introducing a shared `--press-scale` custom property (the repo has no custom-property motion tokens today — do not introduce the first one in this plan).
- `.kazenco-v9-product-card` already uses `cubic-bezier(0.16, 1, 0.3, 1)` for its hover transform — but AUDIT.md explicitly specifies `ease-out` (not a custom cubic-bezier) for button-press feedback at this short a duration, and the user's instruction is explicit: `140ms ease-out`. Use `ease-out`, not the card's own hover curve, for the `:active` rule specifically.
- Exemplar for "state pseudo-class rule placed directly after the element's `:hover` rule in source order": `.kazenco-hero-secondary:hover { border-color: #fff; background: rgba(255,255,255,.15); }` immediately follows `.kazenco-hero-primary:hover, .kazenco-hero-secondary:hover { transform: translateY(-2px); }` at globals.css:482-484 — keep the same adjacency convention for the new `:active` rules.

## Steps

1. **`src/app/globals.css:482-484`** — immediately after the existing block:
   ```css
   .kazenco-hero-primary:hover,
   .kazenco-hero-secondary:hover { transform: translateY(-2px); }
   .kazenco-hero-secondary:hover { border-color: #fff; background: rgba(255,255,255,.15); }
   ```
   insert:
   ```css

   .kazenco-hero-primary:active,
   .kazenco-hero-secondary:active {
     transform: scale(0.98);
     transition: transform 140ms ease-out;
   }
   ```

2. **`src/app/globals.css:1926-1928`** — immediately after:
   ```css
   .kazenco-catalog-button:hover {
     transform: translateY(-2px);
   }
   ```
   insert:
   ```css

   .kazenco-catalog-button:active {
     transform: scale(0.98);
     transition: transform 140ms ease-out;
   }
   ```

3. **`src/app/globals.css`** — locate the closing `}` of the `.inc-button` rule (ends at line 329, `cursor: pointer;` on 328 then `}` on 329). Immediately after it, before the blank line and `.inc-button-conversation` block, insert:
   ```css

   .inc-button:active {
     transform: scale(0.98);
     transition: transform 140ms ease-out;
   }
   ```

4. **`src/app/globals.css:2062-2064`** — immediately after:
   ```css
   .kazenco-v5-industry-card:hover {
     transform: translateY(-2px);
   }
   ```
   insert:
   ```css

   .kazenco-v5-industry-card:active {
     transform: scale(0.98);
     transition: transform 140ms ease-out;
   }
   ```

5. **`src/app/globals.css`** — locate the `.kazenco-v9-product-card:hover { ... }` rule (starts at line 2822). Immediately after its closing `}`, insert:
   ```css

   .kazenco-v9-product-card:active {
     transform: scale(0.98);
     transition: transform 140ms ease-out;
   }
   ```

## Boundaries

- Do NOT touch `.kazenco-v5-product-card` or `.kazenco-product-card` — verified dead CSS (no `.tsx` file references either class name); adding rules to unused selectors would be a no-op that clutters the diff.
- Do NOT touch `.kazenco-nav-link` — this was explicitly rejected in the source audit (100+ views/day header navigation; per AUDIT.md §1 this frequency tier gets no animation, ever).
- Do NOT touch `.kazenco-v9-product-link` or `.kazenco-v9-product-request` (the small inline text links inside each product card) — these are plain color-change hover links, not button-shaped elements; scaling inline text on press is not part of this plan. Press feedback for interactions inside `.kazenco-v9-product-card` is covered by the card-level `:active` rule from Step 5 (CSS `:active` applies to an element and its ancestors during a press, so pressing an inner link already triggers the card's scale).
- Do NOT touch `.kazenco-capability-card` — the whole card is not the clickable target (only a small "View capability" text link inside it is), unlike `.kazenco-v5-industry-card` where the entire card is a `<Link>`. Out of scope for this plan.
- Do NOT modify any existing `:hover` rule's values (transform, box-shadow, border-color, background) — additive only.
- Do NOT add `@media (hover: hover)` gating to these new `:active` rules — that media feature is for hover-intent gating (avoiding false hovers on touch), not press feedback; `:active` already behaves correctly on both mouse and touch.
- Do NOT touch any `.tsx` file — this plan is CSS-only.
- If any step's cited current code doesn't match what you find (drift since commit `ae63021`), STOP and report instead of improvising the insertion point.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` — expect zero errors (no TS files touched, this should be a trivial pass-through, but confirm nothing else is broken).
  - `npm run build` — expect exit 0.
- **Feel check** — run `npm run start`, open `/en` in a real browser:
  - Press and hold the hero's "Request a quotation" button: it should visibly shrink slightly (scale 0.98) while held, and snap back the instant you release — the existing hover lift (`translateY(-2px)`) should still work on hover before/after the press.
  - Press and hold an Industries card (the whole card is a link): same shrink-on-press behavior.
  - Press and hold a Products grid card, including pressing directly on its "View supply scope" inner link: the whole card should shrink (confirms `:active` ancestor-bubbling works as intended), and the inner link's own color-hover should be unaffected.
  - Press "Download Full Product Catalog (PDF)" (`.kazenco-catalog-button` on the homepage Products section) and "Discover KAZENCO" (`.inc-button` on the About section): both shrink on press.
  - In DevTools Animations panel, set playback to 10% while pressing a button — confirm the scale transition is smooth (no jump/flash) and reverses cleanly on release.
  - Confirm nothing shrinks on the header nav links (`.kazenco-nav-link`) or on capability cards' body area (only the small "View capability" link there responds to press, and it has no new styling from this plan) — these were deliberately excluded.
- **Done when**: both mechanical checks pass, all five feel-checks above are confirmed, and `git diff --stat` shows only `src/app/globals.css` changed.
