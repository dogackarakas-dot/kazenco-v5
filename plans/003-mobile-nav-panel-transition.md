# 003 — Animate mobile navigation panel open/close

- **Status**: DONE
- **Commit**: d583fec (planned) — implemented and fixed on top, see Postmortem below
- **Severity**: MEDIUM
- **Category**: Preventing a jarring change / State indication
- **Estimated scope**: 1 file (CSS only), ~15 lines changed in `src/app/globals.css`. No JSX/markup changes.

## Problem

The mobile navigation panel (`.inc-nav`, rendered by `src/components/PremiumHeader.tsx:46-64`) opens and closes with a hard `display: none ↔ block` snap — no transition at all. This is inconsistent with the burger-icon trigger next to it, which already animates its three bars smoothly (`transform`/`opacity`, 180ms `ease`) when toggled — see `src/app/globals.css:1349-1366`. The panel itself has no such treatment, so pressing the menu button produces a mismatched feel: an animated icon next to a panel that just teleports into existence.

Component (unchanged by this plan, shown for context — `menuOpen` toggles the `is-open` class):

```tsx
// src/components/PremiumHeader.tsx:46-64 — current, do not modify
<nav
  id="kazenco-main-navigation"
  className={`inc-nav${menuOpen ? " is-open" : ""}`}
  aria-label={copy.navigation}
>
  <ul>
    {LINKS.map((link) => (
      <li key={link.path}>
        <a
          className="kazenco-nav-link"
          href={`${homePath}${link.path}`}
          onClick={() => setMenuOpen(false)}
        >
          {copy[link.key]}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

Current CSS (the panel and its open state):

```css
/* src/app/globals.css:535-552 — current */
@media (max-width: 900px) {
  .inc-nav {
    position: absolute;
    top: calc(100% + 9px);
    right: 0;
    left: 0;
    display: none;
    padding: 9px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 18px;
    background: rgba(4,15,24,.97);
    box-shadow: 0 18px 54px rgba(0,0,0,.24);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .inc-nav.is-open {
    display: block;
  }
  /* ... .inc-nav ul and .inc-nav.is-open .kazenco-nav-link follow, untouched by this plan ... */
}
```

## Target

`.inc-nav` transitions `opacity` and `transform` on both entry and exit, using `@starting-style` + `transition-behavior: allow-discrete` so the `display: none ↔ block` swap no longer happens instantly — the browser holds the element renderable for the duration of the transition on both directions. Closed state sits 8px above its resting position and fully transparent; open state is at rest and fully opaque.

```css
/* target — src/app/globals.css, inside the existing @media (max-width: 900px) block */
.inc-nav {
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  left: 0;
  display: none;
  padding: 9px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 18px;
  background: rgba(4,15,24,.97);
  box-shadow: 0 18px 54px rgba(0,0,0,.24);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    display 220ms allow-discrete;
}

@starting-style {
  .inc-nav.is-open {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.inc-nav.is-open {
  display: block;
  opacity: 1;
  transform: translateY(0);
}
```

Reduced motion — the panel still opens/closes instantly (via the `display` swap), only the animated properties are dropped:

```css
/* target — inside the existing @media (prefers-reduced-motion: reduce) block at globals.css:2657 */
@media (prefers-reduced-motion: reduce) {
  .inc-nav {
    transition: none;
  }
}
```

## Repo conventions to follow

- Entrance/reveal easing across this codebase is consistently `cubic-bezier(0.16, 1, 0.3, 1)` — used for `.kazenco-v7-reveal` (`globals.css:2549`) and every card/media hover-lift added in plan 002. Reuse this exact curve; do not introduce a new one.
- This repo has no `--ease-*` / `--duration-*` custom properties — durations and curves are written inline at each rule, so write the value directly rather than inventing a token.
- Reduced-motion handling in this repo is "snap to end state, transition removed" — not a gentler version. The existing block at `globals.css:2657-2669` does exactly this for `.kazenco-v7-reveal`/`.kazenco-v7-reveal-onscroll` (`animation: none` + `opacity:1; transform:none`); this plan's reduced-motion addition (`transition: none`) follows the same intent, adapted for a `transition`-based (not `animation`-based) property.
- The burger icon already sets the reference bar for "this trigger enum has motion" — `globals.css:1349-1366`, `transition: transform 180ms ease, opacity 180ms ease`. This plan brings the panel it controls up to the same standard, not to invent a new one.

## Steps

1. In `src/app/globals.css`, inside the `@media (max-width: 900px)` block (starts `globals.css:519`), locate the `.inc-nav { ... }` rule (`globals.css:535-548`) and the `.inc-nav.is-open { display: block; }` rule immediately after it (`globals.css:550-552`).
2. Add `opacity: 0; transform: translateY(-8px);` and the three-property `transition` shown in Target to the `.inc-nav` rule, right after the existing `-webkit-backdrop-filter: blur(18px);` line. Do not remove or reorder any existing declaration in that rule.
3. Replace the `.inc-nav.is-open { display: block; }` rule with `.inc-nav.is-open { display: block; opacity: 1; transform: translateY(0); }`.
4. Immediately before (or after — placement inside the same `@media (max-width: 900px)` block is what matters, not exact line order relative to sibling rules) the `.inc-nav.is-open` rule, add the `@starting-style { .inc-nav.is-open { opacity: 0; transform: translateY(-8px); } }` block shown in Target.
5. Leave `.inc-nav ul` (`globals.css:554-558`) and `.inc-nav.is-open .kazenco-nav-link` (`globals.css:560-565`) untouched.
6. In the existing `@media (prefers-reduced-motion: reduce) { ... }` block (`globals.css:2657-2669`), add a new `.inc-nav { transition: none; }` rule inside it, alongside the existing `.kazenco-v7-reveal` rules already there (as a separate rule — do not merge selectors, `.inc-nav` has no `animation` property to clear, only `transition`).

## Boundaries

- Do NOT touch `src/components/PremiumHeader.tsx` — the `menuOpen`/`is-open` class-toggle logic is already correct and sufficient to drive this purely-CSS transition.
- Do NOT touch the burger icon rules (`globals.css:1328-1366`) — they already animate correctly and are out of scope.
- Do NOT touch `.inc-nav ul` or `.inc-nav.is-open .kazenco-nav-link` (`globals.css:554-565`) — those control the link grid layout, not the panel's own open/close motion.
- Do NOT add a JS-driven animation library or `useState`/`useEffect` mount-delay hack — `@starting-style` + `transition-behavior: allow-discrete` is a pure-CSS solution and this codebase has no motion library.
- Do NOT change the panel's resting position, size, border-radius, blur, or shadow — only `opacity`/`transform`/`display` transition behavior.
- If the `.inc-nav` or `.inc-nav.is-open` rules found in the file don't match the current-code excerpt above (drift since commit `d583fec`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` (expect exit 0, unaffected since this is a CSS-only change) and `npm run build` (expect exit 0, all routes compile — this touches shared `globals.css` so every route using `PremiumHeader` must still build clean).
- **Feel check** (at a viewport ≤900px, e.g. 390×844 in DevTools device toolbar):
  - Open the menu: the panel should fade and slide down into place over ~220ms — it must not still hard-pop into existence.
  - Close the menu: the panel should fade and slide up out over the same ~220ms, not vanish instantly.
  - Click a nav link inside the open panel (which calls `setMenuOpen(false)`): the panel should play the same close transition, not snap shut.
  - Rapidly toggle the menu button several times in a row: the panel should retarget smoothly mid-transition, never getting stuck half-visible or flashing.
  - In DevTools Rendering panel, set `prefers-reduced-motion: reduce`, then open/close the menu again: it should snap open/closed instantly with no fade or slide, exactly like it did before this plan.
  - In DevTools Animations panel, capture one open transition and scrub to 50%: the panel should be partway faded in and partway through its 8px translate, not already fully opaque or still at `display: none`.
- **Done when**: both mechanical checks pass, the open/close feel check above is confirmed at a mobile viewport, and the reduced-motion snap-instantly behavior is confirmed unchanged from before this plan.

## Postmortem — `display` swapped for `visibility`

The plan as written above (using `display: none ↔ block` as the discrete property paired with `@starting-style`) was implemented exactly as specified, then verified in a real (non-headless) browser with high-resolution `requestAnimationFrame` sampling of `getComputedStyle(...).opacity` on every frame. The **close** transition worked perfectly (smooth exponential fade + translate over ~220ms, matching the target curve). The **open** transition did not animate at all — `opacity` and `transform` jumped straight to their final values within the first frame, every time, on every open, both in the live app and in a minimal isolated repro (`<nav>` + two classes, no React, no Next.js) run against the same browser (Chrome 152.0.7977.54). Swapping only the discrete property from `display` to `visibility` (identical CSS otherwise, `.inc-nav` kept `display: block` at all times and toggled `visibility: hidden ↔ visible` instead) fixed it immediately and reproducibly — confirmed with the same rAF-sampling method, both directions now animate correctly.

Root cause was not pinned down further (Chromium engine-internal), but `visibility` is a safe substitute for this exact use case: `.inc-nav` is `position: absolute`, so it doesn't participate in document flow either way, and `visibility: hidden` — like `display: none` — removes the element and its descendants from the accessibility tree and from tab order, and blocks pointer events, so no behavioral regression versus the original `display: none` closed state.

Implemented CSS (differs from the Target section above only in this one respect — `display` is dropped from the `.inc-nav` transition list and property toggle, replaced by `visibility`):

```css
/* src/app/globals.css:535-561 — as implemented */
.inc-nav {
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  left: 0;
  display: block;
  visibility: hidden;
  padding: 9px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 18px;
  background: rgba(4,15,24,.97);
  box-shadow: 0 18px 54px rgba(0,0,0,.24);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    visibility 220ms allow-discrete;
}

@starting-style {
  .inc-nav.is-open {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.inc-nav.is-open {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}
```

The reduced-motion addition (`.inc-nav { transition: none; }` inside the existing block at `globals.css:2671-2686`) is unchanged from the original plan and works correctly with either property.

Verified in a real, headed browser (not headless) after the fix:
- High-resolution `requestAnimationFrame` sampling: both open and close now show a full, smooth ~220ms curve matching `cubic-bezier(0.16, 1, 0.3, 1)` (fast start, slow settle) — confirmed on the live app, not just the isolated repro.
- Rapid open/close/open/close stress test (4 toggles at 60ms intervals, each interrupting the previous transition mid-flight): every intermediate sample showed continuously moving `opacity`/`transform` values, never stuck, never flashing; 400ms after the last toggle the panel was fully and correctly settled closed (`visibility: hidden; opacity: 0`).
- Clicking a nav link inside the open panel: `setMenuOpen(false)` fires, the panel begins closing, and the Next.js client-side navigation to the target route completes correctly.
- `prefers-reduced-motion: reduce`: both open and close snap instantly (full value within 10ms of the click), exactly matching pre-plan behavior.
- Visual screenshots at 390×844 confirm the open panel renders correctly (full opacity, correct position, blur/shadow intact) and the panel is fully gone with no visual artifact after the rapid-toggle stress test.
