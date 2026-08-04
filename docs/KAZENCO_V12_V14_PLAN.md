# KAZENCO V12–V14 Completion Plan

**Prepared:** 04.08.2026  
**Current phase:** V12 — Premium Project Portfolio  
**Purpose:** Preserve the current working state and provide a clear continuation checklist.

## Current audit: where the site still repeats itself

The portfolio currently has three presentation layers:

1. `HeroStack` displays every project with a cover image as large animated cards.
2. `V12 Project Portfolio` displays the same seven photographed projects again as large case studies.
3. `Other Projects` displays the remaining thirteen projects.

The direct duplication between the first two layers is still present. The duplication between
`V12 Project Portfolio` and `Other Projects` has already been removed.

There are also two places where galleries appear:

- On the homepage inside large V12 case studies.
- On individual project detail pages.

This makes the homepage unnecessarily long and reduces the value of opening a project page.

## Audit findings — 04.08.2026

### High priority

1. **The homepage project deck still duplicates the portfolio.** `HeroStack` receives all 11
   projects that have an `image`. Seven reappear in the large V12 section and the remaining
   photographed projects reappear under `Other Projects`. In practice, every photographed
   project is presented twice on the homepage.
2. **Five complete galleries are rendered twice.** The 4 Batyr, Sarens/TCO, TCO Platforms,
   ISKER and Bonatti galleries appear on both the homepage and their detail pages. These
   galleries add substantial page height and image weight to the homepage.
3. **The public website exposes an internal version label.** `V12 project portfolio` should
   not be visible to customers.
4. **Project metadata has three sources of truth.** Core data is in `projects.ts`, gallery/client
   data is in `project-showcase.ts`, and another `META` object exists in the portfolio component.
   Values can drift and some of the component-level metadata is now unreachable.

### Medium priority

1. The `/v12-preview` route remains publicly accessible even though V12 is already on the homepage.
2. The unused duplicate component `src/components/ui/KazencoProjectPortfolio.tsx` still contains
   an older project selection and metadata implementation.
3. The detail-page gallery heading is always `Construction timeline`, including furnishing,
   material-supply and general progress-photo galleries where that description may be inaccurate.
4. Ten of the twenty projects have no project image and publicly show a photography-pending state.
5. Every project contains an unused `externalUrl: "#"`; the field and placeholder values should
   be removed unless external case-study links are planned.
6. Project images include many 2–3 MB PNG files. The homepage currently loads several of them;
   image conversion/compression is required before launch.
7. The lightbox supports Escape and arrow keys but does not yet trap focus, restore focus to the
   opening thumbnail, or make background content inert.

### Verified working

- All twenty canonical `/projects/[slug]` pages are generated in the production build.
- Legacy `/project/[slug]` returns a verified `308 Permanent Redirect` to the canonical route.
- Header section links currently point to sections that exist on the homepage.
- Referenced V12 project, gallery and certificate assets exist; the automated scan found no
  missing asset used by the active V12 pages.
- TypeScript passes, lint has no errors, webpack production build passes and `git diff --check`
  reports no whitespace errors.
- Current lint warnings are image-optimization warnings from existing `<img>` elements.

### QA limitation to close before sign-off

The responsive CSS rules were audited at the 640, 800/900 and 920 px breakpoints. Final visual
approval still requires browser screenshots and real-device checks at 390, 768, 1024 and 1440 px,
especially after the remaining homepage duplication is removed.

## V12 — finish the premium project portfolio

### 1. Remove the remaining project repetition

- [x] Keep the main homepage hero.
- [x] Remove project cards from `HeroStack`, or convert that area into a short three-item proof/capability transition.
- [x] Keep the large V12 case-study section as the primary project presentation.
- [x] Keep `Other Projects` only for projects not shown as large case studies.
- [x] Confirm that every project appears exactly once on the homepage.

**Recommended decision:** Keep the V12 case studies and simplify `HeroStack`. V12 is the newer,
more informative project system and should remain the canonical homepage portfolio.

### 2. Shorten the homepage case studies

- [x] Remove full project galleries from the homepage case studies.
- [x] Keep one cover image, summary, client, location, scope and project link.
- [x] Keep complete galleries only on `/projects/[slug]` detail pages.
- [x] Reduce the vertical gap between large case studies after galleries are removed.

### 3. Clean up public-facing V12 language

- [x] Replace the visible label `V12 project portfolio` with `Selected projects` or `Project portfolio`.
- [x] Remove development/version language from customer-facing copy.
- [ ] Review the `Other Projects` introduction after the final layout is selected.

### 4. Complete project content

- [ ] Add verified photos for Worley Parsons.
- [ ] Add a cover and gallery for Marriott Hotel.
- [ ] Add real photography for priority projects that currently use gradient placeholders.
- [ ] Confirm actual completion years; replace `Completed project` where a verified year exists.
- [ ] Confirm official client spelling and capitalization: ISKER, Bonatti, Sarens/TCO and others.
- [ ] Review all scopes and summaries for consistent industrial terminology.

### 5. Consolidate project code and data

- [x] Merge duplicated project metadata currently split between `projects.ts`,
  `project-showcase.ts` and component-level `META` objects.
- [ ] Keep one canonical project URL: `/projects/[slug]`.
- [x] Redirect legacy `/project/[slug]` URLs permanently to `/projects/[slug]`.
- [x] Update known internal project links to the canonical URL.
- [x] Remove the unused duplicate `src/components/ui/KazencoProjectPortfolio.tsx` after confirming no imports remain.
- [x] Remove `/v12-preview` when the production homepage is approved.

### 6. Responsive and visual QA

- [ ] Inspect homepage at 390, 768, 1024 and 1440 px widths.
- [ ] Inspect a project with a gallery and one without a gallery at the same widths.
- [ ] Verify long titles, long scope values and navigation labels do not overflow.
- [ ] Verify portrait ISKER images crop correctly in cards and open fully in the lightbox.
- [x] Verify keyboard navigation, Escape and arrow keys in project galleries.
- [ ] Verify reduced-motion behavior for the hero and project transitions.
- [ ] Check real iPhone Safari and Android Chrome before V12 sign-off.

### V12 completion criteria

- Every homepage project appears once.
- Galleries exist only on detail pages.
- No customer-facing version labels remain.
- Canonical project routes and legacy redirects work.
- Priority projects use verified content or clearly approved fallbacks.
- Mobile and desktop QA is signed off.
- Typecheck, lint and production build pass.

## V13 — corporate content and conversion

### 1. Corporate narrative

- [ ] Finalize About content, company history and Kazakhstan operating footprint.
- [ ] Clarify the relationship between construction, fit-out, furnishing and material supply.
- [ ] Add verified company statistics and remove any unverified claims.
- [ ] Add warehouse, office, packaging, manufacturing and team photography when available.

### 2. Capabilities and products

- [ ] Create clear capability detail paths or expandable sections.
- [ ] Standardize product categories and technical terminology.
- [ ] Add applicable standards, grades and supply formats where verified.
- [ ] Connect relevant projects to capabilities and products.

### 3. Trust and proof

- [ ] Validate client-logo permissions and image quality.
- [ ] Organize certificates by type and issuing organization.
- [ ] Improve certificate preview, download labels and mobile behavior.
- [ ] Add supplier/authorization context without overstating partnerships.

### 4. RFQ and contact conversion

- [ ] Simplify quotation flow and required fields.
- [ ] Add clear success, validation and error states.
- [ ] Verify telephone, email, address and map information.
- [ ] Add basic spam protection and privacy consent where required.

### V13 completion criteria

- Corporate copy is approved.
- Capabilities and products are easy to understand and navigate.
- Certificates and client proof are verified.
- RFQ/contact flow works on mobile and desktop.

## V14 — launch, performance and governance

### 1. Performance

- [ ] Convert remaining important `<img>` usage to `next/image` where appropriate.
- [ ] Set correct `sizes`, priority/loading behavior and image dimensions.
- [x] Compress oversized project assets; certificate optimization remains a separate review.
- [ ] Re-test Core Web Vitals on mobile and desktop.
- [ ] Investigate the Turbopack production-build stall; keep webpack verification until resolved.

### 2. Accessibility

- [ ] Perform keyboard-only navigation review.
- [ ] Verify focus visibility, modal focus trapping and close behavior.
- [ ] Check heading hierarchy, landmarks, link names and alternative text.
- [ ] Check color contrast and reduced-motion behavior.

### 3. SEO and sharing

- [ ] Add unique metadata for core pages and all project pages.
- [ ] Verify sitemap, robots, canonical URLs and legacy redirects.
- [ ] Add Open Graph images and social-sharing previews.
- [ ] Add Organization and relevant project/service structured data where accurate.

### 4. Production readiness

- [ ] Remove preview routes, unused components and dead CSS.
- [ ] Run typecheck, lint and production build from a clean working state.
- [ ] Test forms and downloads on the deployed preview.
- [ ] Review cookies, privacy content and analytics consent requirements.
- [ ] Create final Git commit, push and Vercel deployment.
- [ ] Complete a post-deployment smoke test on real devices.

### V14 completion criteria

- Performance, accessibility and SEO checks are complete.
- No preview routes or obsolete portfolio implementations remain.
- Production deployment and real-device smoke tests pass.

## Resume point

When development resumes, start with **V12 / Task 1**: remove the photographed-project deck
from `HeroStack` while preserving the main hero, then remove homepage galleries from the large
V12 case studies. This resolves the most visible repetition before any further visual polishing.
