# incredibles.dev Adaptation Notes

Target URL: https://incredibles.dev/
Date: 2026-08-01

## Visual DNA
- Pale warm-gray page background: approx `rgb(241, 241, 241)`.
- Primary text: charcoal `rgb(43, 43, 43)`.
- Typography: oversized display headings with tight line-height and negative letter spacing; simple grotesk body text.
- Header: compact fixed top bar, logo left, pill links/buttons right.
- Controls: rounded pill buttons, duplicated/moving label effect on original; adapted as clean pill hover motion for Kazenco.
- Layout: generous vertical sections, centered max-width, high-contrast headline blocks, cards with soft borders and rounded corners.

## Interaction Model
- Header nav anchors scroll to sections.
- Pricing area uses tabs/selects on original; Kazenco adaptation uses an RFQ/specification panel and existing RFQ modal.
- FAQ items are open/static in the accessibility snapshot; adapted as simple content rows for scannability.

## Kazenco Mapping
- Awards/trust row -> established year, project count, regions, multilingual workforce.
- Hero -> engineering/construction/materials supply proposition.
- Feature cards -> EPC support, industrial supply, fit-out/furnishing, logistics.
- Latest delivery -> selected Kazenco projects.
- Pricing/RFQ -> request quotation and procurement details.
- FAQ -> procurement and project delivery questions.

## Status
Implemented in `src/app/page.tsx` — all copy above is now real Kazenco content (no leftover
incredibles.dev agency copy). CTAs ("Start a conversation", "Request a quote", "Send RFQ") open
the real `RfqButton` mailto flow via `triggerClassName`/`triggerLabel` props rather than a
render-prop/`children` element — passing a JSX element with `cloneElement` from this Server
Component into the client `RfqButton` triggers a Turbopack **dev**-mode-only crash
("Element type is invalid... undefined") in this Next.js 16.2.1 build, even though it renders
fine in `next build`/`next start`. Stick to primitive (string) props across that boundary here.
