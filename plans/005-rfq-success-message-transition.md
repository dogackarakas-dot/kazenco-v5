# 005 — Animate RFQ success message entrance

- **Status**: DONE — one class-list bug found and fixed during verification, see Postmortem below
- **Commit**: 8b6ca41
- **Severity**: LOW
- **Category**: Delight / Preventing a jarring change
- **Estimated scope**: 1 file, 1 line changed in `src/components/ContactModal.tsx`. No new files, no CSS module / `globals.css` changes — this component is styled entirely with inline Tailwind utility classes, unlike the homepage components touched by plans 001-004.

## Problem

When an RFQ submission succeeds, the confirmation message teleports into existence next to the submit button with no entrance treatment at all — a plain conditional render.

```tsx
// src/components/ContactModal.tsx:440-449 — current, do not modify anything except line 443
<div className="mt-6 flex flex-wrap items-center justify-end gap-4">
  {status === "uploading" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[25]} · {uploadProgress}%</p>}
  {status === "submitting" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[26]}</p>}
  {status === "success" && reference && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[27]} · <strong className="text-foreground">{reference}</strong></p>}
  {status === "fallback" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[28]}</p>}
  {status === "error" && <p role="alert" className="m-0 text-sm text-destructive">{copy[29]}</p>}
  <button type="submit" disabled={!canSubmit || status === "uploading" || status === "submitting" || status === "success"} className="flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-[12px] font-semibold uppercase tracking-[0.06em] text-background transition-opacity disabled:cursor-not-allowed disabled:bg-[#d8d8d8] disabled:text-[#9c9c9c]">
    {status === "uploading" ? `${copy[31]} ${uploadProgress}%` : status === "submitting" ? copy[32] : status === "success" ? copy[27] : copy[30]}
  </button>
</div>
```

Only line 443 (the `status === "success"` paragraph) is in scope — see Boundaries.

## Target

```tsx
{/* target — src/components/ContactModal.tsx:443 */}
{status === "success" && reference && (
  <p
    role="status"
    className="m-0 text-sm text-muted-foreground transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-[opacity] motion-reduce:duration-[120ms] starting:translate-y-1 starting:scale-[0.97] starting:opacity-0"
  >
    {copy[27]} · <strong className="text-foreground">{reference}</strong>
  </p>
)}
```

Resulting behavior:
- **Full motion**: on mount, the element starts at `opacity: 0; transform: translateY(4px) scale(0.97);` (via Tailwind's `starting:` variant, which compiles to a `@starting-style` block) and transitions to its resting `opacity: 1; transform: none;` over `320ms` on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Reduced motion**: `motion-reduce:transition-[opacity]` narrows the transitioned property list to `opacity` only (dropping `transform` from it), and `motion-reduce:duration-[120ms]` shortens the duration to `120ms`. Because `transform` is no longer a transitioned property under reduced motion, its change from the `@starting-style` value to the resting value resolves instantly with no visible motion — only opacity still fades in, gently, over `120ms`. This is deliberately *not* the zero-duration instant-snap convention used for the homepage's `.kazenco-v7-reveal` system (plans 001-004) — the user specified a gentle, non-zero reduced-motion treatment for this one-time success confirmation specifically, distinct from that decorative-reveal convention.

No exit animation: `status` only ever leaves `"success"` when the whole modal closes (`close()` in `ContactModal.tsx` resets `status` to `"idle"` and calls `setOpen(false)` together), at which point `FullScreenModal`'s own `820ms` clip-path exit animation is already carrying the entire panel out — this paragraph's own removal is invisible either way and needs no separate exit treatment.

## Repo conventions to follow

- This file (`ContactModal.tsx`) is styled entirely with inline Tailwind utility classes — no `globals.css` rule, no CSS module. Every other animated value in this same file already uses Tailwind's arbitrary-value bracket syntax for non-default durations/curves with **no spaces inside the brackets**: `transition-[clip-path] duration-[820ms] ease-[cubic-bezier(0.76,0,0.24,1)]` (`FullScreenModal.tsx:163`, the panel's own entrance/exit curve). Match that exact bracket style — do not introduce a `globals.css` rule for this component.
- Tailwind 4.2.2 is installed (confirmed via `node_modules/tailwindcss/package.json`), which supports the `starting:` variant (compiles to `@starting-style`) and the built-in `motion-reduce:` variant (compiles to `@media (prefers-reduced-motion: reduce)`) as first-class utilities — no custom CSS or plugin needed for either.
- Reuse the exact same easing curve this whole animation-improvement series has used everywhere else: `cubic-bezier(0.16, 1, 0.3, 1)` (plans 001-004's shared entrance/reveal curve). Do not reuse `FullScreenModal.tsx`'s `cubic-bezier(0.76, 0, 0.24, 1)` — that curve belongs to the panel's own clip-path reveal, a different, larger-scale motion; this is a small, local status-text entrance and should match the smaller-scale family instead.
- Tailwind's spacing scale: `translate-y-1` = `0.25rem` = exactly `4px` at the default root font size — use the scale utility (`translate-y-1`), not an arbitrary `translate-y-[4px]`, since `1` is already exactly the value the user specified and this codebase prefers scale utilities over arbitrary ones wherever the scale already has the exact value (see `mt-6`, `gap-4`, `px-7` etc. throughout this same file — arbitrary brackets are reserved for values with no scale equivalent, like a specific duration or a non-standard color).

## Steps

1. In `src/components/ContactModal.tsx`, locate line 443 (the `status === "success" && reference && <p role="status" ...>` line, inside the `<div className="mt-6 flex flex-wrap items-center justify-end gap-4">` block that starts at line 440).
2. Add these classes to that `<p>`'s existing `className` string, after the existing `m-0 text-sm text-muted-foreground`: `transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-[opacity] motion-reduce:duration-[120ms] starting:translate-y-1 starting:scale-[0.97] starting:opacity-0`.
3. Do not add explicit `opacity-100`/`translate-y-0`/`scale-100` resting-state classes — the element has no other rule setting these properties, so its natural resting computed style (`opacity: 1`, `transform: none`) is already correct and is what `@starting-style` transitions *to*. Adding them would be redundant, not incorrect, but keep the diff minimal per this plan's single-line scope.
4. Do not touch any other line in this file — the `uploading`/`submitting`/`fallback`/`error` paragraphs (lines 441, 442, 444, 445) and the submit `<button>` (line 446-448, whose label also swaps to `copy[27]` when `status === "success"`) are explicitly out of scope; see Boundaries.

## Boundaries

- Only line 443 changes. Do NOT add animation classes to the `uploading`/`submitting`/`fallback`/`error` status paragraphs (lines 441, 442, 444, 445) — the user's request (and this plan) covers only the `"success"` message.
- Do NOT animate the submit `<button>`'s label text (line 447), even though it also reads `copy[27]` when `status === "success"` — it's a text swap inside a persistent element, not a new mount, and was not part of the request.
- Do NOT add an exit/leave animation — see "No exit animation" under Target for why one is unnecessary here.
- Do NOT create a `globals.css` rule or a CSS module for this — stay within this file's existing all-inline-Tailwind convention.
- Do NOT change `copy[27]`, the `reference` value, or any other text/logic in this component.
- If the current code at line 443 doesn't match the excerpt in Problem (drift since commit `8b6ca41`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build`, both expected clean. Additionally, after building, fetch the served CSS bundle and grep for `@starting-style` to confirm Tailwind actually compiled the `starting:` variant into real CSS output (plan 003 found that a real browser bug can hide behind syntax that looks correct — start by confirming the syntax at least *compiled* as expected, the same sanity check used there).
- **Feel check — ENTRANCE direction FIRST, in a real (non-headless) browser.** This is a genuine DOM mount (React conditionally renders the `<p>` into existence, not a CSS `display`/`visibility` toggle of an already-present element), so plan 003's specific `display`+`@starting-style` Chrome bug does not directly apply here — but that is a reasoned expectation, not a substitute for checking. Do not report success on assumption alone:
  - Open the RFQ modal, fill in the required fields, submit successfully (or stub the fetch calls to force `status` to `"success"` with a fake `reference` if a real backend round-trip isn't practical in the test environment).
  - Using in-page `requestAnimationFrame` sampling of `getComputedStyle(pEl).opacity` and `getComputedStyle(pEl).transform` from the moment the element first appears in the DOM, confirm both climb smoothly over the full `320ms` window — `opacity` from `0` to `1`, `transform` from a matrix representing `translateY(4px) scale(0.97)` to `matrix(1, 0, 0, 1, 0, 0)` (identity/none). It must NOT already read the final values on the first sampled frame.
- **Feel check — other checks**:
  - Confirm the submit button's own `disabled` state and label change happen exactly as before (instantly, unaffected by this plan) at the same moment the success message begins its entrance.
  - DevTools Rendering panel, `prefers-reduced-motion: reduce`: repeat the success flow. Confirm `opacity` still visibly (if quickly) animates from `0` to `1` over roughly `120ms`, while `transform` shows no animation at all — it should read its resting identity value on the very first frame, unlike the full-motion case.
  - Confirm no layout shift or clipping artifact occurs during the entrance — the message sits in a `flex flex-wrap` row with the submit button, and the `translateY(4px) scale(0.97)` starting state should not visibly overlap or jump against the button.
- **Done when**: both mechanical checks pass (including the shipped-CSS `@starting-style` grep), the entrance feel check is confirmed first via real rAF sampling showing genuine intermediate frames (not an instant jump — this is the specific failure mode plans 003 and 004 both hit with different mechanisms), and the reduced-motion opacity-only/instant-transform behavior is confirmed.

## Postmortem — `transform` in the transition list did nothing; fixed to `translate,scale`

The plan as written above (`transition-[opacity,transform]`, `starting:translate-y-1 starting:scale-[0.97]`) was implemented exactly as specified. `tsc`/`build` passed clean, and the shipped CSS was confirmed to contain real `@starting-style` blocks for all three `starting:` utilities (`opacity-0`, `scale-[0.97]`, `translate-y-1`) plus correctly-scoped `motion-reduce:` rules inside `@media (prefers-reduced-motion:reduce)`.

The first real-browser entrance check (filling and submitting the RFQ form with `/api/rfq` intercepted to force a deterministic `status:"success"`, then sampling `getComputedStyle` on every frame from the moment the success `<p>` mounted) showed `opacity` animating correctly — smooth 0→1 over ~320ms — but `transform` reading `"none"` on *every single sampled frame*, including frames where `opacity` was still mid-fade. That is the exact "already at final value on frame one" signature that sank plans 003 and 004, so per this plan's own requirement it was not waved through.

Root cause, found by inspecting the actual shipped CSS rather than guessing: **Tailwind v4 does not implement `translate-y-*`/`scale-*` utilities via the legacy `transform` property at all** — it uses the modern standalone CSS `translate` and `scale` properties instead:

```css
/* actual shipped CSS for the utilities this plan used */
.starting\:translate-y-1{--tw-translate-y:calc(var(--spacing) * 1);translate:var(--tw-translate-x) var(--tw-translate-y)}
.starting\:scale-\[0\.97\]{scale:.97}
```

Neither utility ever touches `transform` — its computed value stays at the initial `none` throughout, exactly what was observed. Listing `transform` in `transition-property` (`.transition-\[opacity\,transform\]{transition-property:opacity,transform;...}`) transitioned a property that was never actually changing, so nothing visibly happened for the translate/scale portion — only `opacity` (which *is* a real, changing property) animated.

Fix: change the `transition-[opacity,transform]` class to `transition-[opacity,translate,scale]`, listing the two properties Tailwind v4 actually uses. No other class needed to change — `starting:translate-y-1`, `starting:scale-[0.97]`, `motion-reduce:transition-[opacity]` (which was already correct — it only ever listed `opacity`, never `transform`) all stay as originally planned.

```tsx
{/* src/components/ContactModal.tsx:443 — as implemented */}
{status === "success" && reference && (
  <p
    role="status"
    className="m-0 text-sm text-muted-foreground transition-[opacity,translate,scale] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-[opacity] motion-reduce:duration-[120ms] starting:translate-y-1 starting:scale-[0.97] starting:opacity-0"
  >
    {copy[27]} · <strong className="text-foreground">{reference}</strong>
  </p>
)}
```

Re-verified in a real, headed browser against the live app after the fix, using a `MutationObserver` armed *before* clicking submit (rather than polling after the fact) to catch the true first frame:

- **Full motion**: `opacity` 0→1, `translate` `0px 4px`→`0px 0px`, `scale` `0.97`→`1` (reported as `"none"` once fully settled), all three animating together smoothly over ~320-340ms with the same fast-start/slow-settle shape (matching `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Reduced motion**: `translate`/`scale` read `"none"` on every single sampled frame including the first — confirming they snap instantly with zero animation. `opacity` still animates gently, 0→1 over ~120-140ms — the "gentle, not zero" behavior the user specifically asked for, distinct from the homepage's zero-duration reveal convention.
- Screenshot at 1440px confirms the settled state: "Request received · RFQ-TEST-0042" renders cleanly next to the disabled "REQUEST RECEIVED" button, no layout shift, no clipping, no overlap.

The RFQ submission itself was not sent to the real backend — `/api/rfq` (both the `GET` availability check and the `POST` submission) was intercepted via Puppeteer request interception and answered with a synthetic `{ available: true }` / `{ reference: "RFQ-TEST-0042" }`, so no real email or blob upload was triggered by this verification.
