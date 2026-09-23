> **Superseded — previous project.**
>
> This file documents **SOIRA**, the premium lingerie storefront the ECDOS
> modules in `design-os/` were previously applied to. It does **not** govern
> this build and its brand, palette, typography, sizing and product rules are
> all contradicted by the electronics documentation.
>
> Kept for reference only. The governing documents for this project are:
> [`COMMERCE_RULES_ELECTRONICS.md`](COMMERCE_RULES_ELECTRONICS.md) and
> [`INFORMATION_ARCHITECTURE_ELECTRONICS.md`](INFORMATION_ARCHITECTURE_ELECTRONICS.md)
>
> Reusable ECDOS modules in [`design-os/`](design-os/) are unedited and remain
> the quality standard.

---

# UX_SPEC.md — SOIRA

## Primary Audience
Adult women who shop lingerie, underwear, sleepwear and loungewear. Trend-aware, mobile-first, socially-discovered, and equally interested in everyday comfort and special pieces. They care about fit, fabric, comfort and aesthetics, and they expect fast, respectful product discovery.

## Primary UX Goals
1. Make the brand feel premium and trustworthy within five seconds.
2. Let users reach a relevant category in one or two actions.
3. Make size, cup, band, fit, support and material information genuinely easy to understand.
4. Preserve editorial emotion without slowing down shopping.
5. Make mobile the best experience, not a reduced desktop layout.
6. Treat the customer's body with respect at every touchpoint.

## Homepage Journey
Hero → category choice → new arrivals → fabric/comfort story → mood-based discovery → best sellers → fit help → lookbook → campaign → manifesto → magazine → newsletter.

## Discovery Principles
- New arrivals and best sellers are always one tap away.
- Search opens instantly with trending searches, recent searches, category and product suggestions.
- The mega menu is organised by **model**, **ihtiyaca göre** and **koleksiyon**, with at most two editorial images.
- Product cards expose name, category, price, colours and one badge — nothing more.
- Filters stay reachable: sticky sidebar on desktop, sticky bottom-sheet trigger on mobile.
- Active filter count and chips are always visible; clearing is one action.
- Filter and sort state is reflected in the URL query.

## Sizing UX
- Bras use a two-step selector: band (70–85) then cup (A–D), combined into `75B`.
- Unavailable combinations are disabled with a visible strike treatment plus `aria-disabled`, never colour alone.
- Non-bra products use XS–XL.
- The size guide is available as a modal from every product page and as a full `/beden-rehberi` page.
- Guidance language is practical and non-medical, and explicitly states that fit varies between models.

## Trust Content
Realistic placeholders only: secure shopping, easy returns, delivery estimate, material and care, size help, customer service, privacy and terms. No reviews, ratings, awards, certifications or sustainability claims are invented.

## Mobile Rules
- Thumb-accessible header actions and sticky product CTA
- Bottom-sheet filter and sort
- No hover-dependent information
- No horizontal overflow at 375px
- Rails scroll with snap and visible affordance
- Drawers lock body scroll and restore it exactly
- Lookbook hotspots open as a sheet, not a hover popover

## Demo Interactions
Frontend-only state for: search overlay, mega menu, mobile navigation, filters and sorting, wishlist, colour/size selection, quantity, cart drawer, promo code, newsletter success, size guide modal, product gallery, and toast feedback.

Cart, wishlist and recently viewed persist to `localStorage` behind a hydration-safe provider: the first client render matches the server, then persisted state is applied.

## Error and Empty States
- Search with no results (with reset action and trending suggestions)
- Empty favourites — “Favorilerin seni bekliyor.”
- Empty cart — with routes back into the catalogue
- Filters that match nothing — with a clear-filters action
- Invalid collection slug → `notFound()`
- Missing product → `notFound()`
- Newsletter validation error announced through `role="alert"`
- Loading skeletons matching final geometry

## Accessibility Acceptance
- Full keyboard path through header, mega menu, drawers and dialogs
- Focus trapped inside dialogs and returned to the opener on close
- Escape closes every overlay
- Body scroll locks and restores without layout jump
- Screen-reader names for all icon-only controls
- Error copy programmatically attached to inputs
- Reduced-motion support across every animated surface
- Live-region announcements for cart and wishlist changes
