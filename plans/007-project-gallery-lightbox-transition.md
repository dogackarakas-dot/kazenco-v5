# 007 — Animate the project gallery lightbox open/close

- **Status**: DONE — one reduced-motion gap found and fixed during verification, see Postmortem below
- **Commit**: 6492c84
- **Severity**: LOW
- **Category**: Preventing a jarring change
- **Estimated scope**: 2 files (`src/components/ProjectGallery.tsx`, `src/components/ProjectGallery.module.css`), ~45 lines. No new dependencies. Deliberately reuses `FullScreenModal.tsx`'s proven mount/unmount state mechanism rather than inventing a new one — see "Mechanism, copied from FullScreenModal" below.

## Problem

`ProjectGallery`'s lightbox (`src/components/ProjectGallery.tsx:152-208`) is a plain conditional render gated on `activeIndex !== null` — it mounts and unmounts instantly, with no entrance or exit treatment. An earlier, entrance-only version of this fix was deliberately deferred because the exit had nowhere to animate: React unmounts the `<div>` the instant `activeIndex` becomes `null`, so there is no time window in which a CSS transition could play on the way out.

```tsx
// src/components/ProjectGallery.tsx:16-21 — current, state declarations
export function ProjectGallery({ images, title, locale, alts }: Props) {
  const copy = DETAIL_COPY[locale].project;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeIndex !== null;
```

```tsx
// src/components/ProjectGallery.tsx:50-130 — current, the focus-trap/scroll-lock/keydown effect
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const inertedElements: HTMLElement[] = [];

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }

      if (event.key === "Tab") {
        /* ...focus-trap logic, unchanged... */
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    /* ...inert-siblings logic, unchanged... */

    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      /* ...un-inert siblings, restore focus, unchanged... */
    };
  }, [isOpen, images.length]);
```

```tsx
// src/components/ProjectGallery.tsx:152-208 — current, the lightbox JSX
{activeIndex !== null ? (
  <div
    ref={dialogRef}
    className={styles.lightbox}
    role="dialog"
    aria-modal="true"
    aria-label={`${title} ${copy[10]}`}
  >
    <button ref={closeRef} className={styles.close} type="button" onClick={() => setActiveIndex(null)} aria-label={closeLabel}>×</button>
    <button className={styles.previous} type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)} aria-label={previousLabel}>←</button>
    <div className={styles.fullImage}>
      <Image src={images[activeIndex]} alt={alts?.[activeIndex] ?? `${title} ${copy[10]} ${activeIndex + 1}`} fill sizes="100vw" priority />
    </div>
    <button className={styles.next} type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)} aria-label={nextLabel}>→</button>
    <p>{activeIndex + 1} / {images.length}</p>
  </div>
) : null}
```

```css
/* src/components/ProjectGallery.module.css:11-16 — current */
.lightbox { position: fixed; inset: 0; z-index: 1000; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 1rem; padding: clamp(1rem, 3vw, 3rem); background: rgba(4, 10, 8, .96); color: white; }
.fullImage { position: relative; width: 100%; height: calc(100svh - 7rem); }
.fullImage img { object-fit: contain; }
.lightbox button { z-index: 2; display: grid; width: 3rem; height: 3rem; place-items: center; border: 1px solid rgba(255, 255, 255, .28); border-radius: 50%; background: rgba(255, 255, 255, .08); color: white; font-size: 1.25rem; cursor: pointer; }
.close { position: absolute; top: 1.5rem; right: 1.5rem; }
.lightbox > p { position: absolute; bottom: 1.5rem; left: 50%; margin: 0; transform: translateX(-50%); font-size: .72rem; letter-spacing: .12em; }
```

## Mechanism, copied from FullScreenModal

`src/components/FullScreenModal.tsx` (used by `ContactModal`'s RFQ modal) already solves exactly this problem — animate both in and out, with the DOM staying mounted long enough for the exit transition to actually play — and is proven working in this codebase. Read in full before implementing; the mechanism, verbatim:

```tsx
// src/components/FullScreenModal.tsx:7, 18-24, 40-107, 144-147 — current, for reference, do not modify this file
export type ModalPhase = "entering" | "open" | "exiting";

const DURATION_MS = 820;
const CLIP_CLOSED = "inset(100% 20% 0% 20% round 24px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 0px)";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ...inside the component:
const [mounted, setMounted] = useState(false);
const [phase, setPhase] = useState<ModalPhase>("entering");

useEffect(() => {
  if (!open) return undefined;
  // ...focus/scroll-lock/inert setup...
  setMounted(true);
  setPhase("entering");
  // ...
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => {
      setPhase("open");
      panelRef.current?.focus();
    });
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
}, [open]);

useEffect(() => {
  if (open || !mounted) return undefined;
  setPhase("exiting");
  const timeout = window.setTimeout(
    () => {
      setMounted(false);
      // ...restore scroll/inert/focus...
    },
    prefersReducedMotion() ? 0 : DURATION_MS,
  );
  return () => window.clearTimeout(timeout);
}, [open, mounted]);

// ...
if (!mounted) return null;

const reduced = prefersReducedMotion();
const clipPath = reduced ? CLIP_OPEN : phase === "open" ? CLIP_OPEN : CLIP_CLOSED;
```

The shape to copy: a `mounted` boolean gates DOM presence; a `phase` (`"entering" | "open" | "exiting"`) drives the animated values; **entrance** sets `mounted=true` + `phase="entering"` synchronously, then a **double `requestAnimationFrame`** flips `phase` to `"open"` (this is what actually makes the CSS transition play — it forces two real paints of the closed state before the open state is requested, which is why this hand-rolled technique works instead of `@starting-style`, whose Chrome-specific failure modes plans 003 and 004 already found and root-caused in this exact codebase); **exit** sets `phase="exiting"` synchronously (starting the reverse transition immediately) and only calls `setMounted(false)` after a `setTimeout` matching the transition's own duration, so the DOM isn't ripped out mid-animation. **Reduced motion** is checked in JS (not just a CSS media query) in two places: the rendered value is forced straight to its "open"/settled state regardless of phase, and the exit timeout becomes `0`ms — an instant snap both ways, consistent with this codebase's `.kazenco-v7-reveal` convention (plans 001-004), not plan 005's gentler RFQ-message treatment. Copy this same instant-snap choice here, since it's what the component actually being copied does.

## Target

**1. State — `src/components/ProjectGallery.tsx`, add alongside the existing `activeIndex` state:**

```tsx
type LightboxPhase = "entering" | "open" | "exiting";
const EXIT_DURATION_MS = 280; // matches .fullImage's transition duration below, the longer of the two — see note

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ...inside the component, alongside the existing activeIndex/dialogRef/closeRef declarations:
const [displayIndex, setDisplayIndex] = useState(0);
const [mounted, setMounted] = useState(false);
const [phase, setPhase] = useState<LightboxPhase>("entering");

useEffect(() => {
  if (activeIndex !== null) setDisplayIndex(activeIndex);
}, [activeIndex]);
```

`displayIndex` exists because `activeIndex` itself goes back to `null` the instant the user closes the lightbox (the close button and Escape both call `setActiveIndex(null)` directly) — but the lightbox now stays *mounted* for `EXIT_DURATION_MS` after that, still needing a valid image index to render during the fade-out. `displayIndex` remembers the last non-null `activeIndex` and is what the JSX reads for the image/alt/counter/prev/next — see Steps.

**2. Entrance/exit effects, replacing the role `isOpen` currently plays for mount timing:**

```tsx
useEffect(() => {
  if (!isOpen) return;
  setMounted(true);
  setPhase("entering");
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => {
      setPhase("open");
    });
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
}, [isOpen]);

useEffect(() => {
  if (isOpen || !mounted) return;
  setPhase("exiting");
  const timeout = window.setTimeout(
    () => setMounted(false),
    prefersReducedMotion() ? 0 : EXIT_DURATION_MS,
  );
  return () => window.clearTimeout(timeout);
}, [isOpen, mounted]);
```

**3. The existing focus-trap/scroll-lock/keydown effect (`ProjectGallery.tsx:50-130`) must key on `mounted`, not `isOpen`** — otherwise scroll gets unlocked and background siblings get un-inerted the instant the user clicks close, while the lightbox is still visibly fading out for another `EXIT_DURATION_MS`, letting the page behind scroll/receive clicks through a still-visible overlay. Change only the guard and the dependency array:

```tsx
// target — ProjectGallery.tsx:51 and :130, everything else in this effect is unchanged
useEffect(() => {
  if (!mounted) return;
  // ...unchanged body...
}, [mounted, images.length]);
```

Inside that same effect's `handleKeyDown`, add one guard so Escape/arrow-key/Tab handling goes inert during the fade-out (scroll-lock and inert-siblings still correctly persist through it via the outer `mounted` guard above — only the *keyboard* handling should stop reacting once the user has already triggered a close):

```tsx
// target — ProjectGallery.tsx:57, first line inside handleKeyDown
function handleKeyDown(event: KeyboardEvent) {
  if (!isOpen) return;
  // ...rest of the existing handler body, unchanged...
}
```

**4. The lightbox JSX (`ProjectGallery.tsx:152-208`)** — gate on `mounted` instead of `activeIndex !== null`, read `displayIndex` everywhere the current code reads `activeIndex`, add `data-phase={phase}`:

```tsx
{mounted ? (
  <div
    ref={dialogRef}
    className={styles.lightbox}
    data-phase={phase}
    role="dialog"
    aria-modal="true"
    aria-label={`${title} ${copy[10]}`}
  >
    <button ref={closeRef} className={styles.close} type="button" onClick={() => setActiveIndex(null)} aria-label={closeLabel}>×</button>
    <button className={styles.previous} type="button" onClick={() => setActiveIndex((displayIndex - 1 + images.length) % images.length)} aria-label={previousLabel}>←</button>
    <div className={styles.fullImage}>
      <Image src={images[displayIndex]} alt={alts?.[displayIndex] ?? `${title} ${copy[10]} ${displayIndex + 1}`} fill sizes="100vw" priority />
    </div>
    <button className={styles.next} type="button" onClick={() => setActiveIndex((displayIndex + 1) % images.length)} aria-label={nextLabel}>→</button>
    <p>{displayIndex + 1} / {images.length}</p>
  </div>
) : null}
```

**5. CSS — `src/components/ProjectGallery.module.css`, replacing the `.lightbox` and `.fullImage` rules at lines 11-13:**

```css
.lightbox {
  position: fixed; inset: 0; z-index: 1000; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 1rem; padding: clamp(1rem, 3vw, 3rem); background: rgba(4, 10, 8, .96); color: white;
  opacity: 0;
  transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox[data-phase="open"] {
  opacity: 1;
}

.fullImage {
  position: relative; width: 100%; height: calc(100svh - 7rem);
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox[data-phase="open"] .fullImage {
  opacity: 1;
  transform: scale(1);
}
```

Everything else in the module (`.fullImage img`, `.lightbox button`, `.close`, `.lightbox > p`, the `@media (max-width: 640px)` block) is untouched.

**Note on the two different durations (250ms overlay vs. 280ms content) and why `EXIT_DURATION_MS` is 280, not 250:** `.fullImage` is a child of `.lightbox`, so its own opacity always multiplies with the parent's — by the time `.lightbox` itself reaches `opacity: 0` at 250ms, everything inside it is already fully invisible regardless of where `.fullImage`'s own (slower) transition happens to be, so there is no visible artifact from the 30ms gap. The unmount timeout must still wait for the *longer* of the two (`280ms`) rather than the shorter one, purely so `setMounted(false)` never fires while any transition on the subtree is technically still running — using the shorter value would work visually in this specific case (nothing left to see after 250ms either way) but is the wrong general principle to encode, and a future edit that reorders which duration is longer would silently reintroduce a cut-off transition.

Reduced motion — extend the existing site convention (`globals.css`'s `@media (prefers-reduced-motion: reduce)` block handles `globals.css`-scoped classes; this component's CSS lives in its own module, so it gets its own block, same as `KazencoProjectMap.module.css` already does for `.markerCount`/`.projectList`):

```css
/* target — new block, appended to src/components/ProjectGallery.module.css */
@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .fullImage {
    transition: none;
  }
}
```

This alone is sufficient — with `transition: none`, the `[data-phase="open"]` rules still apply their final `opacity`/`transform` values instantly, and the JS side's `prefersReducedMotion() ? 0 : EXIT_DURATION_MS` (Target section 2) makes the unmount timeout fire immediately too, so the whole open/close becomes an instant swap end to end — matching FullScreenModal's own reduced-motion behavior exactly, per the "Mechanism" section above.

## Why plan 005's Tailwind lesson does not apply here

Plan 005 found that Tailwind v4's `translate-y-*`/`scale-*` utility classes compile to the standalone CSS `translate`/`scale` properties, not `transform` — so a `transition-[opacity,transform]` utility class transitioned nothing for the translate/scale portion. `ProjectGallery.module.css` is hand-written CSS in a `.module.css` file with no Tailwind utility classes involved anywhere in this component; `transform: scale(0.97)` written directly in plain CSS is the correct, standard property here, and `transition: opacity 280ms ..., transform 280ms ...` (Target section 5) correctly targets it. No `translate`/`scale` standalone-property substitution is needed or applicable in this file.

## Repo conventions to follow

- Same easing family as this entire series: `cubic-bezier(0.16, 1, 0.3, 1)`. Per the user's explicit instruction, this plan copies FullScreenModal's *state-management mechanism* (mounted/phase/double-rAF/timeout), not its curve — `cubic-bezier(0.76, 0, 0.24, 1)` stays specific to that component's own large clip-path panel reveal.
- `data-phase={phase}` as a plain DOM attribute, read by a CSS attribute selector (`.lightbox[data-phase="open"]`) rather than FullScreenModal's approach of computing the value in JS and applying it via an inline `style` prop — this is a deliberate adaptation, not a deviation to flag for concern: FullScreenModal is styled with inline Tailwind utility classes and has no CSS Modules file of its own, so computing `clipPath` in JS and passing it as `style={{ clipPath }}` is how *that* file already does everything. `ProjectGallery` is styled entirely through `ProjectGallery.module.css`, with zero inline styles anywhere in the component today — an attribute-selector-driven CSS Modules rule keeps this component internally consistent with itself, while still reproducing the exact same underlying `mounted`/`phase` state machine.
- Reduced-motion handling matches the CSS-module-local pattern already established by `KazencoProjectMap.module.css` (plan 006): a `@media (prefers-reduced-motion: reduce)` block scoped to this one file, not a shared `globals.css` block (since this component's classes aren't defined there).
- `prefersReducedMotion()` as a small local function duplicated in this file, matching the existing convention: `FullScreenModal.tsx`, `KazencoHeroContent.tsx`, and `useScrollReveal.ts` each already define their own inline `window.matchMedia("(prefers-reduced-motion: reduce)").matches` check rather than sharing one utility — there is no existing shared helper to import instead.

## Steps

1. In `src/components/ProjectGallery.tsx`, add the `LightboxPhase` type, `EXIT_DURATION_MS` constant, and local `prefersReducedMotion()` function shown in Target section 1, near the top of the file (module scope, alongside the `Props` type — matching where `FullScreenModal.tsx` places its own equivalents).
2. Inside the component, add `displayIndex`/`mounted`/`phase` state and the `displayIndex`-tracking effect shown in Target section 1, placed after the existing `isOpen` declaration.
3. Add the two entrance/exit effects shown in Target section 2, placed after the `displayIndex`-tracking effect.
4. Modify the existing focus-trap/scroll-lock/keydown effect exactly as shown in Target section 3: change its guard from `if (!isOpen) return;` to `if (!mounted) return;`, change its dependency array from `[isOpen, images.length]` to `[mounted, images.length]`, and add `if (!isOpen) return;` as the first line inside `handleKeyDown`. Nothing else in that effect changes.
5. Update the lightbox JSX exactly as shown in Target section 4: the outer conditional changes from `activeIndex !== null ? (...)` to `mounted ? (...)`, add `data-phase={phase}` to the `.lightbox` div, and replace every remaining read of `activeIndex` inside that JSX block (the `Image` `src`/`alt`, the counter `<p>`, and both prev/next `onClick` handlers) with `displayIndex`. The `onClick={() => setActiveIndex(null)}` on the close button and the `setActiveIndex(...)` calls inside prev/next `onClick` stay calling `setActiveIndex` (not `setDisplayIndex`) — only the *values being read* change to `displayIndex`, not which state setter gets called.
6. In `src/components/ProjectGallery.module.css`, replace the `.lightbox` and `.fullImage` rules (lines 11-13) with the versions in Target section 5, and append the new `@media (prefers-reduced-motion: reduce)` block at the end of the file.

## Boundaries

- Do NOT touch `FullScreenModal.tsx` — read it for reference only.
- Do NOT add any transition to prev/next image navigation while the lightbox is already open — only the open/close lifecycle animates. Swapping `displayIndex` while `mounted` stays `true` (arrow keys or the prev/next buttons) does not retrigger the entrance/exit effects, since those are keyed on `isOpen`, not `activeIndex`/`displayIndex` — confirm this stays true after the edit, don't add an image-crossfade as a "nice to have."
- Do NOT add `disabled`/`pointer-events: none` guards on the close/prev/next buttons during the `"exiting"` phase. The keydown handler is guarded (Target section 3) but the buttons themselves are not — clicking prev/next in the ~280ms fade-out window is treated as an accepted, low-consequence edge case, not something to engineer around.
- Do NOT change `.grid`, `.grid button`, `.grid img`, or any thumbnail-grid styling — this plan only touches the lightbox overlay and its content.
- Do NOT invent a different easing curve or duration than the ones specified (250ms/280ms, `cubic-bezier(0.16, 1, 0.3, 1)`).
- If the current code at any cited location doesn't match the excerpts in Problem above (drift since commit `6492c84`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build`, both expected clean.
- **Feel check, in a real (non-headless) browser — both directions checked separately, per this series' now-established discipline ("syntax looks right" has never once been sufficient across plans 003-006)**:
  - Navigate to a project detail page with a gallery (check `src/app/projects/[slug]/page.tsx` or similar for a project with 4+ images), open the lightbox by clicking a thumbnail.
  - **Entrance**: using in-page `requestAnimationFrame` sampling of `getComputedStyle(lightboxEl).opacity` and `getComputedStyle(fullImageEl).opacity`/`.transform` from the moment the click handler runs, confirm both climb smoothly over their real durations (~250ms and ~280ms respectively) — not already at final values on the first sampled frame.
  - **Exit**: click the close button (or press Escape), and using the same sampling approach, confirm both fade back down smoothly over their real durations — and confirm the `<div className={styles.lightbox}>` element is still present in the DOM partway through (e.g. at ~150ms after the close click) and is genuinely gone from the DOM only after `EXIT_DURATION_MS` has elapsed (query `document.querySelector` for it at intervals, or check via the same `MutationObserver` pattern used in plans 004/006's verification).
  - **Rapid open/close/open stress test**: open the lightbox, immediately close it, immediately reopen it, repeat 3-4 times in quick succession (faster than the 250-280ms durations). Confirm no stuck-at-partial-opacity state, no duplicate/orphaned lightbox `<div>` left in the DOM, and the final state (open or closed, whichever the last action was) settles correctly.
  - **Prev/next during open**: confirm navigating between images via the arrow buttons or arrow keys does NOT retrigger the entrance fade/scale — the image swaps its content instantly (unchanged pre-existing behavior), only open/close animate.
  - **Background interaction during exit**: click close, and *before* the exit animation finishes (within the ~280ms window), attempt to scroll the page or interact with an element behind the lightbox. Confirm the page stays locked/inert until the lightbox is actually gone — this is the specific bug the `isOpen`→`mounted` rescoping in Target section 3 fixes; verify it actually did.
  - DevTools Rendering panel, `prefers-reduced-motion: reduce`: repeat open and close — both should snap instantly with no fade/scale, and the DOM node should unmount immediately on close (no lingering `mounted` window at all).
- **Done when**: both mechanical checks pass, entrance and exit are each confirmed with real intermediate frames (not instant jumps) via rAF sampling, the rapid open/close stress test shows no stuck/duplicate/orphaned state, prev/next navigation is confirmed unaffected, the background-interaction-during-exit fix is confirmed working, and reduced motion is confirmed to snap instantly both ways with immediate unmount.

## Postmortem — reduced-motion entrance had a 1-2 frame flash, fixed to match FullScreenModal exactly

Everything in Target above was implemented exactly as specified and worked correctly on the first attempt for full-motion entrance, full-motion exit, the rapid-toggle stress test, prev/next non-retriggering, and the background-interaction/scroll-lock fix (all confirmed via real headed-browser measurement, detailed below). One gap surfaced specifically under `prefers-reduced-motion: reduce`, caught by testing it explicitly rather than assuming the CSS-only `transition: none` approach (Target section 5's reduced-motion block) was sufficient on its own.

The entrance effect (Target section 2) always runs its double-`requestAnimationFrame` sequence — `phase` starts at `"entering"` and only becomes `"open"` two frames later — regardless of `prefersReducedMotion()`. With only `transition: none` handling reduced motion in CSS, the element still rendered with `opacity: 0` (the `"entering"` value) for those first 1-2 frames before snapping to `opacity: 1` once `phase` flipped — a brief, real flash-to-invisible-then-visible, not the zero-frame-delay instant appearance `FullScreenModal` produces (its `clipPath = reduced ? CLIP_OPEN : phase === "open" ? CLIP_OPEN : CLIP_CLOSED` forces the *open* value from the very first render whenever `reduced` is true, independent of `phase`).

Fixed by mirroring that exact pattern — computing the effective phase value at render time instead of relying on the CSS transition alone to mask it:

```tsx
// src/components/ProjectGallery.tsx — as implemented, replaces Target section 4's data-phase={phase}
data-phase={prefersReducedMotion() ? "open" : phase}
```

Re-verified: the very first sampled frame after the click now reads `{ opacity: '1', phase: 'open' }` under reduced motion — no flash, exact zero-frame-delay parity with `FullScreenModal`. Confirmed the full-motion entrance (unaffected by this change, since `prefersReducedMotion()` is `false` there) still animates correctly afterward.

### Full verification results (real headed browser, `localhost:3000/en/projects/sarens-tco-tengiz`, a project with a 9-image gallery)

- **Entrance**: `MutationObserver`-armed before the thumbnail click, then `requestAnimationFrame` sampling of both `.lightbox` and `.fullImage` — both climbed smoothly from `0` to `1` (opacity) and `.fullImage`'s `transform` matrix from `scale(0.97)` to identity, over ~280-310ms, confirmed via real intermediate frames.
- **Exit**: same sampling from the close-button click — both faded back down symmetrically. Confirmed via direct DOM presence checks that `.lightbox` remained in the document for the full ~280ms (present at 150ms, still present at 284ms) and was gone by 301ms — matching `EXIT_DURATION_MS`.
- **Background interaction during exit** (the specific fix from Target section 3): sampled `document.body.style.overflow` and the header's `inert` state every 25ms through a close click. Both stayed locked (`overflow: "hidden"`, `header.inert === true`) for the entire ~280ms the lightbox was still in the DOM, and released only once it was actually gone (at ~314ms) — confirming the page cannot be scrolled or interacted with while the lightbox is still visibly fading out.
- **Rapid open/close/open/close/open stress test** (5 toggles at 100ms intervals, each interrupting the previous transition): 500ms after the last toggle, exactly one `.lightbox` element existed in the DOM (no duplicates/orphans), correctly settled fully open (`opacity: 1`) with scroll still locked, matching the last action taken.
- **Prev/next during open**: clicking the next button and pressing `ArrowRight` both swapped the displayed image (counter went `1/9` → `2/9` → `3/9`) while `phase` stayed `"open"` and opacity stayed at `1` throughout every sampled frame — confirmed no re-entrance animation triggers on navigation.
- **Reduced motion**: open snaps to full visibility on the first frame (post-fix); close removes the DOM node and unlocks scroll within 30ms of the click (well under the 280ms full-motion duration), confirming the JS-side `prefersReducedMotion() ? 0 : EXIT_DURATION_MS` timeout (Target section 2) was already correct as planned — only the entrance's `data-phase` computation needed the fix above.

One incidental, pre-existing (not introduced by this plan) finding noted during verification: `styles.previous`/`styles.next` in `ProjectGallery.module.css` were never defined as their own CSS rules — only `.close` has a dedicated positioning rule, so the prev/next buttons render with an empty `className` and rely entirely on the shared `.lightbox button` rule plus CSS Grid auto-placement for their position. This predates this plan (confirmed by checking the original file before any edits) and doesn't affect the animation work, so it was left alone per this plan's Boundaries — flagging it here only so it isn't mistaken for something this plan broke.
