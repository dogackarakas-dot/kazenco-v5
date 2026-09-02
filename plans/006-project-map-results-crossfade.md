# 006 — Cross-fade the project map results list on filter/city change

- **Status**: DONE — implemented exactly as planned, no bug found (see Verification note at the end)
- **Commit**: 778a575
- **Severity**: LOW
- **Category**: Preventing a jarring change
- **Estimated scope**: 2 files (`src/components/KazencoProjectMap.tsx`, `src/components/KazencoProjectMap.module.css`), ~15 lines total. No new dependencies, no wrapper elements.

## Scope clarification: list only, not `resultsHeader`

The request named `.projectList` (`KazencoProjectMap.tsx:189-212`, `KazencoProjectMap.module.css:214-231`) as the target and asked this plan to settle whether `.resultsHeader`'s `h3`/`strong` (the city name and the zero-padded project count, `KazencoProjectMap.tsx:181-187`) should animate too, since they update in the same click.

**Decision: list only. `resultsHeader` keeps its instant update.** Reasoning:

- The city name and count are the most important pieces of feedback for the exact action the user just took (clicking a marker or a filter chip) — confirming "yes, you're now looking at Tengiz, 4 projects" as fast as possible is more useful than confirming it gently. This matches the `find-animation-opportunities` skill's own Gate: "data the user is trying to read should not move for style."
- It keeps the fix CSS-only and single-purpose: one `key` on one element, one keyframe. Animating `resultsHeader` too would need its own separate remount key (`h3`/`strong` are plain text nodes, not a list Framer/CSS techniques key off naturally) for a benefit that's debatable rather than clear.
- The original request's own line references (`.projectList` / `KazencoProjectMap.module.css:214-231`) already scope to the list; this section makes that explicit rather than silently assuming it.

If this call is wrong, say so at plan review — it is a one-line change to also key `.resultsHeader > div` the same way and give it the same animation class, using the identical keyframe.

## Problem

```tsx
// src/components/KazencoProjectMap.tsx:189-212 — current, do not modify structure beyond adding `key`
<div className={styles.projectList}>
  {cityProjects.map((project) => (
    <Link href={`/${locale}/projects/${project.slug}`} className={styles.project} key={project.slug}>
      <figure>
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 800px) 28vw, 150px"
          />
        ) : (
          <span aria-hidden="true">{project.title.slice(0, 1)}</span>
        )}
      </figure>
      <div>
        <span>{project.category}</span>
        <h4>{project.title}</h4>
        <p>{project.role}</p>
      </div>
      <span aria-hidden="true">↗</span>
    </Link>
  ))}
</div>
```

```css
/* src/components/KazencoProjectMap.module.css:214-219 — current */
.projectList {
  min-height: 0;
  overflow-y: auto;
  padding: .75rem 0;
  overscroll-behavior: contain;
}
```

`cityProjects` is derived from `filter` and `activeCity` state (`KazencoProjectMap.tsx:70-72`). Clicking a filter chip or a map marker changes one or both, and `.projectList`'s children swap to the new city/category's project links with no transition of any kind — an instant content replacement.

## Target

React is forced to fully unmount and remount `.projectList` on every filter/city change by keying it off both values, so its CSS `animation` (which only plays on mount, never on update) genuinely restarts from `0%` every time — no `transition`/`@starting-style` involved, so this plan's mechanism is unrelated to every bug found in plans 003-005.

```tsx
{/* target — src/components/KazencoProjectMap.tsx:189 */}
<div className={styles.projectList} key={`${filter}-${activeCity}`}>
```

```css
/* target — src/components/KazencoProjectMap.module.css, replaces the .projectList rule at 214-219 */
.projectList {
  min-height: 0;
  overflow-y: auto;
  padding: .75rem 0;
  overscroll-behavior: contain;
  animation: kazenco-map-fade 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes kazenco-map-fade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Deliberately **no `animation-fill-mode: forwards`** — see "Repo conventions to follow" for why that's a considered omission, not an oversight.

Reduced motion, extending the existing block rather than adding a new one:

```css
/* target — src/components/KazencoProjectMap.module.css:258-260 */
@media (prefers-reduced-motion: reduce) {
  .markerCount { transition: none; }
  .projectList { animation: none; }
}
```

### Expected side effect: this also fades in on first page load

Because a CSS `animation` plays on *any* mount, not just a `key`-driven remount, `.projectList` will also fade in the first time this section renders/scrolls into view — the component isn't wired into the `useScrollReveal`/`kazenco-v7-reveal-onscroll` IntersectionObserver system (confirmed: no such import or class anywhere in `KazencoProjectMap.tsx`), so today this section has no entrance treatment at all. This is treated as an acceptable, arguably welcome side effect consistent with the rest of the site's motion language, not a bug to suppress — flagging it here so it isn't "discovered" and second-guessed mid-implementation. Wiring this section into the scroll-reveal system is out of scope for this plan.

## Repo conventions to follow

- Same easing family as every other plan in this series: `cubic-bezier(0.16, 1, 0.3, 1)` (`.kazenco-v7-reveal` at `globals.css:2549`, plan 003's nav panel, plan 005's RFQ success message). Do not invent a new curve.
- Keyframe shape mirrors `.kazenco-v7-reveal` exactly (`globals.css:2591-2620`, `opacity: 0; transform: translateY(30px); → opacity: 1; transform: translateY(0);`) — same two properties, same direction, only the distance (`6px` vs `30px`, per the user's own smaller-scale spec for this smaller UI region) and duration (`260ms` vs `850ms`, appropriate for a frequent filter interaction vs. a rare page-scroll reveal) differ.
- **Deviation, with reason**: `.kazenco-v7-reveal` uses `animation-fill-mode: forwards` because `.kazenco-v7-reveal-onscroll` (`globals.css:2606-2609`) declares a *competing* base state (`opacity: 0; transform: translateY(30px);`) outside the keyframes that the animation must permanently override. `.projectList` has no such competing declaration — its only `opacity`/`transform` values exist inside the keyframes, and the keyframe's own `to` state (`opacity: 1; transform: translateY(0)`) already matches what plain, unanimated CSS would produce anyway. Omitting `forwards` here costs nothing visually and avoids recreating the exact bug this series already found and fixed once during plan 002's verification: a `forwards`-filled animation retains cascade priority over its animated properties *indefinitely*, even after visually finishing, silently blocking any later `:hover`/`:active`/other rule that targets the same property on the same element. `.projectList` has no such rule today, but there's no reason to leave that footgun for whoever adds one later.
- Reduced-motion handling in this file already exists at `KazencoProjectMap.module.css:258-260` for `.markerCount` — extend that block, don't create a second `@media (prefers-reduced-motion: reduce)` block in the same file.
- CSS Modules convention: this file already defines `@keyframes` inline in the module (none currently exist here, but the pattern of module-scoped, component-local styles is the whole point of `.module.css` — do not move this keyframe to `globals.css`, unlike plans 001-005 which all touched the shared stylesheet because their components used the homepage's hand-written global CSS classes, not CSS Modules).

## Steps

1. In `src/components/KazencoProjectMap.tsx`, add `key={\`${filter}-${activeCity}\`}` to the `.projectList` `<div>` at line 189 (shown in Target). Use a template-string join with a separator, not bare concatenation (`filter + activeCity`) — `Filter` values are free-form category strings (`"Fit-out & Furnishing"`, etc.) and `CityKey` values are short slugs, so an unseparated join could theoretically collide (e.g. two different `filter`/`activeCity` pairs producing the same joined string); the separator makes that impossible in practice for this exact type shape and costs nothing.
2. In `src/components/KazencoProjectMap.module.css`, add the `animation: kazenco-map-fade 260ms cubic-bezier(0.16, 1, 0.3, 1);` line to the existing `.projectList` rule (214-219) and add the new `@keyframes kazenco-map-fade { ... }` block (placement anywhere in the file is fine; put it directly after the `.projectList` rule for locality).
3. In the existing `@media (prefers-reduced-motion: reduce) { .markerCount { transition: none; } }` block (258-260), add `.projectList { animation: none; }` as a second rule inside the same block.
4. Do not add `animation-fill-mode: forwards` — see Target and Repo conventions above.
5. Do not touch `.resultsHeader`, `h3`, or `strong` — see Scope clarification above.

## Boundaries

- Only `.projectList` (the results list container) gets the `key` and the animation. `.resultsHeader`'s city name (`h3`) and count (`strong`) are explicitly out of scope — see Scope clarification.
- Do NOT add `animation-fill-mode: forwards` — see the reasoned deviation above.
- Do NOT wire this section into the `useScrollReveal`/`kazenco-v7-reveal-onscroll` system — the first-load fade-in is an accepted side effect, not a request to add IntersectionObserver-gated triggering.
- Do NOT touch `.project` (the individual project link items), their hover background-color transition (`KazencoProjectMap.module.css:230, 233`), or `.markerCount`'s own transition (`145`) — all unrelated and already correct.
- Do NOT add scroll-position preservation for `.projectList` when it remounts — losing scroll position on a filter change (returning to the top of a fresh list) is expected, reasonable behavior for a `key`-driven remount, not a regression to fix.
- If the current code at either cited location doesn't match the excerpts above (drift since commit `778a575`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build`, both expected clean.
- **Feel check, in a real (non-headless) browser** — this plan's mechanism (a React `key`-driven remount triggering a plain CSS `@keyframes animation`, not a `transition`/`@starting-style`) is a different animation primitive than every bug found in plans 003-005, so none of those specific failure modes are expected to apply here — but per this series' now-established discipline, that expectation must still be checked empirically, not assumed:
  - Navigate to the page containing the project map (`/${locale}/projects` or wherever `KazencoProjectMap` renders), scroll it into view.
  - Click a different filter chip or a different map marker. Using in-page `requestAnimationFrame` sampling of `getComputedStyle(listEl).opacity` and `.transform` from the moment the click handler runs, confirm both climb smoothly from `0`/`translateY(6px)`'s matrix to `1`/identity over the full `260ms` — not already at the final value on the first sampled frame.
  - **Rapid re-filter stress test** (explicitly requested): click through 3-4 different filter chips in quick succession (faster than 260ms apart), and separately click through 3-4 different map markers in quick succession. Confirm each click produces its own fresh `0→1`/`translateY(6px)→0` fade — since each click creates a brand-new DOM node (different `key`), there is no mid-transition retargeting to verify (unlike plans 001/003's `transition`-based approach), but confirm there is no visual flashing, no stuck-at-partial-opacity list, and no leftover duplicate list rendered from a prior click.
  - Confirm the count (`strong`) and city name (`h3`) in `.resultsHeader` update instantly, with no fade, at the same moment the list begins its animation — confirming the Scope clarification decision reads correctly in practice, not just in theory.
  - Confirm the first page load / scroll-into-view of this section also shows the list fading in once (the accepted side effect noted in Target) — not a rendering glitch.
  - DevTools Rendering panel, `prefers-reduced-motion: reduce`: repeat the filter/marker clicks — the list should swap content instantly with no fade, exactly like the pre-plan behavior.
- **Done when**: both mechanical checks pass, the fade is confirmed with real intermediate frames (not an instant jump) on both a filter-chip change and a marker change, the rapid re-filter stress test shows no flashing/stuck/duplicate-list artifacts, `resultsHeader` is confirmed to update instantly and unaffected, and the reduced-motion instant-swap behavior is confirmed.

## Verification note

Implemented exactly as specified above with no deviation. Unlike plans 003-005, real-browser verification found no bug here — the `key`-driven remount + plain `@keyframes` `animation` mechanism worked correctly on the first attempt:

- Filter-chip click: `opacity` and `transform` both climbed smoothly from `0`/`matrix(1,0,0,1,0,6)` to `1`/`none` over ~270ms, matching the `cubic-bezier(0.16, 1, 0.3, 1)` fast-start/slow-settle shape.
- Marker click: identical smooth curve, confirmed independently.
- `resultsHeader`'s city name and count updated instantly on both interactions, unaffected by the list's animation — confirming the Scope clarification decision holds in practice.
- Rapid re-filter stress test (5 filter clicks at 80ms intervals, each interrupting the previous one before its 260ms animation finished): 500ms after the last click, exactly one `.projectList` element existed in the DOM (no orphaned/duplicate nodes from prior remounts), fully settled at `opacity: 1; transform: none`. Screenshot confirms a clean final render with no visual artifact.
- `prefers-reduced-motion: reduce`: the list read `opacity: 1; transform: none` on the very first sampled frame after a filter click — instant swap, no animation, exactly matching pre-plan behavior.
- The first-load fade-in side effect (noted in Target) was observed and is cosmetically consistent with the rest of the site.
