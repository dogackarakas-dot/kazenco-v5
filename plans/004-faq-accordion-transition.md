# 004 — Animate FAQ accordion open/close

- **Status**: DONE — implemented via a different mechanism than planned, see Postmortem below
- **Commit**: 7f8b0f8 (planned)
- **Severity**: LOW
- **Category**: State indication
- **Estimated scope**: 1 file (CSS only), ~35 lines changed/added in `src/app/globals.css`. No JSX/markup changes — `src/components/KazencoFaq.tsx` stays exactly as-is.

## Problem

The FAQ accordion (`src/components/KazencoFaq.tsx:28-34`, native `<details>`/`<summary>`) opens and closes with a hard native snap — no height transition, no chevron/marker of any kind (the default disclosure triangle is explicitly suppressed).

```tsx
// src/components/KazencoFaq.tsx:26-36 — current, do not modify
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
```

Current CSS:

```css
/* src/app/globals.css:1014-1032 — current */
.inc-faq details {
  border-bottom: 1px solid color-mix(in oklab, var(--foreground) 14%, transparent);
  padding: 1.3rem 0;
}

.inc-faq summary {
  cursor: pointer;
  list-style: none;
}

.inc-faq summary::-webkit-details-marker {
  display: none;
}

.inc-faq details p {
  max-width: 43rem;
  margin: 1rem 0 0;
  line-height: 1.35;
}
```

There is also a shared typography rule that must NOT be touched by this plan (it sets `summary`'s font, not its layout):

```css
/* src/app/globals.css:769-777 — current, do not modify */
.inc-estimator h3,
.inc-faq summary {
  margin: 0;
  font-family: var(--font-clone-display);
  font-size: clamp(1.65rem, 2.5vw, 2.55rem);
  font-weight: 400;
  line-height: 0.92;
  letter-spacing: -0.05em;
}
```

## Target

Two independent pieces, both CSS-only, no `display`/`visibility` toggling and no `@starting-style`/`allow-discrete` anywhere — see "Why no `@starting-style` this time" below for why that's deliberate.

**1. Height transition.** `<details>` becomes a 2-row CSS grid (`summary` row = `auto`, answer-`<p>` row = `0fr` closed / `1fr` open). The browser's own UA-stylesheet rule that sets the answer `<p>` to `display:none` when `<details>` is closed is overridden by an explicit author rule that keeps it always rendered — author-origin CSS always wins over user-agent-origin CSS regardless of specificity, so a plain `.inc-faq details p { ... }` rule (no `!important` needed) is enough to defeat it. Visibility when closed is then controlled purely by the collapsed `0fr` row height plus `overflow: hidden` clipping the `<p>`'s own box — never by `display`.

```css
/* target — replaces src/app/globals.css:1014-1017 */
.inc-faq details {
  display: grid;
  grid-template-rows: auto 0fr;
  border-bottom: 1px solid color-mix(in oklab, var(--foreground) 14%, transparent);
  padding: 1.3rem 0;
  transition: grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.inc-faq details[open] {
  grid-template-rows: auto 1fr;
}
```

```css
/* target — replaces src/app/globals.css:1028-1032 */
.inc-faq details p {
  display: block;
  overflow: hidden;
  max-width: 43rem;
  margin: 0;
  padding-top: 1rem;
  line-height: 1.35;
}
```

The `display: block;` line is not cosmetic — it is the override this whole technique depends on. Chrome's UA stylesheet includes `details:not([open]) > *:not(summary) { display: none; }`. Without an unconditional author-origin `display` declaration on `.inc-faq details p`, that UA rule still wins while closed (author beats UA only where an author rule actually exists for that property — an author rule that never sets `display` leaves the UA's `display: none` completely unchallenged). That would mean: closed → `<p>` stays `display: none` regardless of what `grid-template-rows` is doing; then the moment `open` is added, the UA rule stops matching and the element's default `display: block` (from the browser's default `p { display: block }` rule, also UA-origin but no longer in conflict) applies instantly, in the same frame as the click — display flips from `none` to `block` with no transition, which is exactly the class of bug plan 003 hit with the mobile nav panel. Setting `display: block;` unconditionally (not gated by `[open]`) makes the computed `display` value never change at all across open/close — it defeats the UA rule at all times, so the only thing that changes visually between states is the continuous `grid-template-rows` value, which is what actually transitions.

**2. Chevron.** A CSS-only, `currentColor` border-drawn chevron in `summary::after`, rotating 90° between closed and open. `summary` becomes a flex row so the chevron sits at the end, aligned to the top of the (possibly 2-line, since questions can wrap on narrow/Cyrillic/Turkish locales) question text.

```css
/* target — replaces src/app/globals.css:1019-1022 */
.inc-faq summary {
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.inc-faq summary::after {
  content: "";
  flex-shrink: 0;
  width: 0.5em;
  height: 0.5em;
  margin-top: 0.35em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.inc-faq details[open] summary::after {
  transform: rotate(45deg);
}
```

`.inc-faq summary::-webkit-details-marker { display: none; }` (`globals.css:1024-1026`) stays untouched — Safari's own native-marker suppression, unrelated to the new chevron.

Reduced motion — both pieces snap instantly, matching this repo's existing "remove the transition, don't soften it" convention:

```css
/* target — inside the existing @media (prefers-reduced-motion: reduce) block at globals.css:2672-2688 */
@media (prefers-reduced-motion: reduce) {
  .inc-faq details {
    transition: none;
  }

  .inc-faq summary::after {
    transition: none;
  }
}
```

## Why no `@starting-style` this time

Plan 003 (mobile nav panel, `plans/003-mobile-nav-panel-transition.md`) found that `display: none ↔ block` combined with `@starting-style` + `transition-behavior: allow-discrete` silently fails to animate the OPEN direction on Chrome 152.0.7977.54 — confirmed both in the live app and in an isolated non-React repro; only the CLOSE direction animated. The fix there was to swap the discrete property from `display` to `visibility`.

This plan sidesteps that entire bug class on purpose: `<details>`'s own `display` toggling is neutralized (the answer `<p>` is kept permanently rendered via a plain author-origin `display` override — see Target above), and the only property being transitioned is `grid-template-rows` — a continuous value interpolation, not a discrete on/off property. No `@starting-style`, no `allow-discrete`, no `visibility` toggle anywhere in this plan. This is expected to be immune to the plan-003 bug class, but **must still be confirmed empirically** — see Verification below, which requires checking the OPEN direction first in a real headed browser, exactly because plan 003 taught us that "the mechanism looks different so it should be fine" is not sufficient on its own without a real check.

## Repo conventions to follow

- Entrance/interaction easing across this codebase is consistently `cubic-bezier(0.16, 1, 0.3, 1)` (`.kazenco-v7-reveal` at `globals.css:2549`, the mobile nav panel from plan 003 at `globals.css:550-552`). Reuse this exact curve for the height transition. The chevron's rotation also uses it, for visual family consistency within this one component — do not invent a second curve for FAQ specifically.
- Durations in this repo are written inline, no `--duration-*`/`--ease-*` custom properties exist — write `320ms`/`250ms` literally, matching how plan 003 wrote `220ms` literally.
- Reduced-motion handling in this repo is "drop the transition entirely, snap to whatever the current state's end value already is" — not a gentler version. The existing block at `globals.css:2672-2688` does this with `transition: none` (see plan 003's `.inc-nav` addition, `globals.css:2685-2687`, as the direct exemplar for this plan's two additions).
- No icon library import for this chevron — `KazencoFaq.tsx` currently imports no icon component, and this repo already has a convention of literal `aria-hidden` glyphs/pseudo-elements for small decorative marks (e.g. the `↗` spans in `KazencoProducts.tsx:85` and `KazencoProjectMap.tsx:209`) rather than pulling in `lucide-react` for every small mark. A pure-CSS `::after` border-chevron matches that convention and needs no new import.

## Steps

1. In `src/app/globals.css`, replace the `.inc-faq details { ... }` rule (`globals.css:1014-1017`) with the Target version: add `display: grid;`, `grid-template-rows: auto 0fr;`, and the `transition: grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1);` line. Keep the existing `border-bottom` and `padding` declarations unchanged.
2. Immediately after it, add the new `.inc-faq details[open] { grid-template-rows: auto 1fr; }` rule.
3. Replace the `.inc-faq summary { ... }` rule (`globals.css:1019-1022`) with the Target version: keep `cursor: pointer;` and `list-style: none;`, add `display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;`.
4. Do NOT touch `.inc-faq summary::-webkit-details-marker` (`globals.css:1024-1026`) — leave it exactly as-is, immediately after the summary rule.
5. After it, add the new `.inc-faq summary::after { ... }` rule and the `.inc-faq details[open] summary::after { transform: rotate(45deg); }` rule, both shown in Target.
6. Replace the `.inc-faq details p { ... }` rule (`globals.css:1028-1032`) with the Target version: add `display: block;` as the first declaration, add `overflow: hidden;`, change `margin: 1rem 0 0;` to `margin: 0;` plus a new `padding-top: 1rem;` line, keep `max-width: 43rem;` and `line-height: 1.35;` unchanged.
   - **The `display: block;` line is required, not optional.** Chrome's UA stylesheet hides closed `<details>` content via `details:not([open]) > *:not(summary) { display: none; }`. An unconditional author-origin `display: block;` on `.inc-faq details p` is what defeats that rule at all times (open and closed alike), so the element's computed `display` never changes — only `grid-template-rows` does. Skip this line and the element is genuinely `display: none` while closed and snaps to `display: block` the instant `open` is added, with no transition — reproducing plan 003's display-snap bug by a different route.
   - **The margin→padding swap is also required, not cosmetic**: a `margin-top` on the grid item is outside its border box, so `overflow: hidden` on the item does not clip it — closing the accordion would leave a permanent ~1rem gap between the summary and the invisible, zero-height paragraph. `padding-top` is inside the border box and collapses to nothing along with the row.
7. In the existing `@media (prefers-reduced-motion: reduce) { ... }` block (`globals.css:2672-2688`), add the two new rules shown in Target (`.inc-faq details { transition: none; }` and `.inc-faq summary::after { transition: none; }`), alongside the existing `.inc-nav` rule already there from plan 003.
8. Do not touch `src/components/KazencoFaq.tsx` at all — no wrapper `<div>`, no new class names, no JS open-state tracking. The native `open` attribute (fully browser-managed, no `useState` involved) is sufficient to drive every rule above via the `[open]` attribute selector.

## Boundaries

- Do NOT modify `src/components/KazencoFaq.tsx` — this is a CSS-only plan.
- Do NOT touch the shared typography rule at `globals.css:769-777` (`.inc-estimator h3, .inc-faq summary { font-family: ...; font-size: ...; }`) — it sets the question's type, not its layout, and `.inc-estimator h3` shares it; changing it would affect an unrelated component.
- Do NOT touch `.inc-faq summary::-webkit-details-marker` (`globals.css:1024-1026`) or `.inc-faq` / `.inc-faq-list` (`globals.css:1004-1012`, if still at that range — see drift note below).
- Do NOT use `@starting-style`, `allow-discrete`, `display`, or `visibility` toggling anywhere in this plan — see "Why no `@starting-style` this time" above.
- Do NOT add a JS open-state tracker, a wrapper `<div>` around the `<p>`, or any dependency — the two-row-grid-on-`<details>`-itself technique needs neither.
- If the current code found for any of `.inc-faq details`, `.inc-faq summary`, `.inc-faq summary::-webkit-details-marker`, or `.inc-faq details p` doesn't match the excerpts above (drift since commit `7f8b0f8`), STOP and report instead of improvising — re-`grep -n` the exact current line numbers before editing rather than trusting the numbers in this plan.

## Verification

- **Mechanical**: `npx tsc --noEmit` (expect exit 0, unaffected — CSS-only) and `npm run build` (expect exit 0, every route sharing `globals.css` still compiles).
- **Feel check — OPEN direction FIRST, in a real (non-headless) browser** (per the lesson from plan 003, where only the close direction was checked first and the open direction turned out to be silently broken):
  - Before clicking anything, check `getComputedStyle(pEl).display` on a closed item's `<p>` — it must already read `"block"` (proof the `display: block;` override from Step 6 is winning over the UA's `display: none`, not just visually hidden by chance).
  - Load the homepage, scroll to the FAQ section. Click a closed FAQ item's summary.
  - In the same sampling loop, log `getComputedStyle(pEl).display` on every frame alongside `gridTemplateRows` — it must read `"block"` on every single frame, including the very first one right after the click. If it ever reads `"none"` at any point, the Step 6 override isn't taking effect and the animation is not really happening (the row is transitioning while the element itself is invisible).
  - Confirm the second row's computed height climbs smoothly from `0px` to the answer's full content height over ~320ms — it must NOT jump straight to full height in the first frame the way plan 003's `display`-based open transition initially did.
  - Confirm the chevron (`summary::after`) rotates smoothly from its closed to open angle over the same ~250ms window, not snapping instantly.
  - Only after confirming the open direction, check the close direction the same way (sample `gridTemplateRows` shrinking back to `0px` over ~320ms, chevron rotating back).
- **Feel check — other checks**:
  - Open one item, then immediately open a second item without closing the first: both should be independently open (native `<details>` behavior, not an `<details name="...">` exclusive-accordion group — confirm the current markup has no `name` attribute added, since none was specified in Target).
  - Click a summary repeatedly in quick succession (stress test, same spirit as plan 003's rapid-toggle test): the row height and chevron rotation should retarget smoothly on each click, never getting stuck at a partial height or a partial rotation.
  - Confirm the closed state has no residual gap between the summary text and the border-bottom below it — the `margin`→`padding` swap in Step 6 should mean a closed item's total height is just the summary row plus the existing `padding: 1.3rem 0`, with no leftover ~1rem sliver from the collapsed answer row.
  - Confirm long questions that wrap to two lines (test with a Turkish or Russian locale, which run longer than English for the same content) still show the chevron aligned to the top of the first line, not vertically centered against the full 2-line block.
  - DevTools Rendering panel, `prefers-reduced-motion: reduce`: open/close snaps instantly, both the row height and the chevron rotation, with no transition.
- **Done when**: both mechanical checks pass, the open-direction feel check is confirmed first and shows a real smooth transition (not an instant jump), the close-direction and remaining feel checks all pass, and the reduced-motion snap-instantly behavior is confirmed.

## Postmortem — `grid-template-rows` on `<details>` replaced with native `::details-content`

The plan as written above (Steps 1-8, `display: grid; grid-template-rows: auto 0fr ↔ auto 1fr` directly on `<details>`, the `display: block;` override on `<p>`) was implemented exactly as specified. `tsc`/`build` passed clean. The chevron rotation (Step 3/5) and the `display: block;` override (Step 6, confirmed via computed-style sampling to genuinely stay `"block"` on every frame, exactly as the plan's verification step demanded) both worked correctly. The height transition did not: `grid-template-rows` jumped straight to its final value on the very first sampled frame after every open, on the real live app, every time — never an intermediate value.

Five rounds of isolated, minimal (non-React, non-Next.js) reproduction narrowed the cause precisely:

1. Ruled out: Next.js/Lightning CSS's `@supports` fallback splitting for `color-mix()` (which does split `.inc-faq details` into multiple physical rules in the shipped bundle) — reproduced the shipped split verbatim in isolation, still broken; then reproduced the *same* CSS with the `@supports` split removed entirely, *still* broken.
2. Ruled out: `[open]` attribute selector specifically — an author `.is-open` class toggled synchronously inside a native `toggle` event listener (no `[open]` selector involved at all) failed identically.
3. Root cause found: **`<details>` cannot smoothly transition `grid-template-rows` on itself when its own `open` attribute changes, regardless of what triggers the change** (native `[open]` selector, a same-tick author class, or even a class applied one `requestAnimationFrame` later — all failed when the transitioning property lived on `<details>` itself). A structurally identical `<div>` with a plain `.open` class transitions the identical CSS perfectly (confirmed side-by-side, same page, same browser, same moment). This is specific to `<details>`'s own box — moving the *same* `grid-template-rows` declarations to a child `<div>` wrapper did not help on its own either, unless *combined* with deferring the class change by one `requestAnimationFrame`; deferring alone (on `<details>` itself, no wrapper) also did not help. The only working combination found for the grid-rows technique was "child wrapper `<div>` + one-frame-deferred class" — which would have required both a markup change (a wrapper `<div>` around `<p>`) and a small `toggle`-event-driven JS effect in `KazencoFaq.tsx`, breaking two of this plan's explicit Boundaries ("Do NOT modify `KazencoFaq.tsx`", "Do NOT add ... a wrapper `<div>`").

Rather than revise those boundaries, the user chose a different, zero-JS, zero-markup-change path: the native `::details-content` pseudo-element (Chrome 131+; confirmed supported and fully working on Chrome 152.0.7977.54, the version this whole investigation ran against). `::details-content` is a pseudo-element the browser itself special-cases specifically to make this class of animation work — it represents `<details>`'s non-`<summary>` content region and can be transitioned (including `content-visibility` via `transition-behavior: allow-discrete`, matching the plan-003 pattern) without any of the problems found above, because the browser handles the open/close content lifecycle for it internally rather than through ordinary author-class/attribute style recalculation.

Verified in a real, headed browser, on the live app (not just the isolated repro), covering everything this plan's Verification section asked for plus the plan-003-informed "open direction first" requirement:

- High-resolution `requestAnimationFrame` sampling of `getComputedStyle(details, "::details-content").blockSize`/`.opacity`: **open** direction climbs smoothly from `0px`/`0` to the full content height/`1` over ~325ms (confirmed on the very first frame it is already animating, not instantly at the final value); **close** direction mirrors it symmetrically back to `0px`/`0`.
- Rapid-click stress test (4 clicks at 60ms intervals, each interrupting the previous transition): settles correctly 500ms later with no stuck or flickering state.
- Two FAQ items opened independently (native `<details>` behavior, no `name` grouping): both stay open simultaneously, confirmed via `hasAttribute("open")` on all four items and a screenshot.
- `prefers-reduced-motion: reduce`: full open state reached within one frame of the click, no animation — matches this repo's existing "snap instantly" convention.
- Screenshot at 1440px confirms two simultaneously-open items render correctly: chevrons rotated for both, answer text and spacing correct, no residual gap on the still-closed items.

### Implemented CSS (replaces the plan's Target/Steps 1, 2, and 6 above; Steps 3-5 and 7's chevron rules were implemented exactly as planned and are unaffected)

```css
/* src/app/globals.css — as implemented, replacing Steps 1-2 */
.inc-faq details {
  border-bottom: 1px solid color-mix(in oklab, var(--foreground) 14%, transparent);
  padding: 1.3rem 0;
  interpolate-size: allow-keywords;
}

.inc-faq details::details-content {
  opacity: 0;
  block-size: 0;
  overflow-y: clip;
  transition: content-visibility 320ms allow-discrete,
    opacity 320ms cubic-bezier(0.16, 1, 0.3, 1),
    block-size 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.inc-faq details[open]::details-content {
  opacity: 1;
  block-size: auto;
}
```

```css
/* src/app/globals.css — as implemented, replacing Step 6; the display:block
   override and the margin→padding swap are BOTH unnecessary with this
   technique, since ::details-content (not our own CSS) now owns the
   show/hide + clipping lifecycle. <p> is back to its original pre-plan form. */
.inc-faq details p {
  max-width: 43rem;
  margin: 1rem 0 0;
  line-height: 1.35;
}
```

The reduced-motion addition targets the pseudo-element instead of `<details>` itself:

```css
/* src/app/globals.css — inside the existing @media (prefers-reduced-motion: reduce) block */
.inc-faq details::details-content {
  transition: none;
}
```

`interpolate-size: allow-keywords` is scoped to `.inc-faq details` only (not set globally on `html`), so it has no effect outside this one component — confirmed working identically scoped as it did in an unscoped repro.
