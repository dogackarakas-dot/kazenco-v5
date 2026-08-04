# KAZENCO V18 Launch Checklist

Status date: 4 August 2026

## Ready

- [x] Next.js 16.2.1 production build succeeds for all 36 routes.
- [x] Node.js runtime is pinned to `24.x`.
- [x] EN, RU, TR and KZ routes are generated.
- [x] Canonical and hreflang metadata is configured.
- [x] Sitemap contains 100 localized URLs.
- [x] Preview deployment is protected with `noindex, nofollow, noarchive`.
- [x] Production robots configuration allows indexing when `KAZENCO_PREVIEW` is absent.
- [x] Security headers include HSTS (Vercel), nosniff, frame denial, referrer policy, permissions policy and COOP.
- [x] RFQ attachments use private Vercel Blob storage and signed links.
- [x] RFQ and About modals load on demand.
- [x] Mobile Lighthouse median: performance 88, LCP 2.69 s, TBT 315 ms, CLS 0.027.
- [x] Lighthouse accessibility and best-practices scores: 100.

## External actions required before public launch

- [ ] Connect `kazenco.com` and `www.kazenco.com` to the intended Vercel production project.
- [ ] Confirm the existing website/DNS owner and lower DNS TTL before cutover.
- [ ] Add and verify the Resend DKIM/SPF records for the selected sending domain.
- [ ] Confirm `RESEND_EMAIL_DOMAIN` exactly matches the verified Resend domain.
- [ ] Submit one production RFQ and confirm receipt at `info@kazenco.com`.
- [ ] Add Google Search Console verification and submit `/sitemap.xml`.
- [ ] Decide whether analytics is required; add it only after selecting a provider and consent approach.
- [ ] Ensure `KAZENCO_PREVIEW` is not present on the public production project.
- [ ] Confirm public `/robots.txt` allows crawling and does not return an `X-Robots-Tag: noindex` header.
- [ ] Test `https://kazenco.com/en`, `/ru`, `/tr`, `/kz`, one project page, one capability page and the RFQ flow after cutover.

## Recommended cutover order

1. Create or select the public Vercel project without `KAZENCO_PREVIEW`.
2. Copy only the required RFQ environment variables to that project.
3. Deploy and test using its temporary Vercel URL.
4. Verify the Resend sending domain and run a real RFQ delivery test.
5. Connect `kazenco.com` and `www.kazenco.com`.
6. Verify HTTPS, canonical URLs, robots, sitemap and language routes.
7. Add Search Console and monitor errors after launch.

The current `kazenco-v14-preview` project must remain a private/noindex validation environment and should not become the indexed public site while `KAZENCO_PREVIEW=1` is configured.
