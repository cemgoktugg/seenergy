> **Superseded — previous project.**
>
> This file documents **SOIRA**, the premium lingerie storefront the ECDOS
> modules in `design-os/` were previously applied to. It does **not** govern
> this build and its brand, palette, typography, sizing and product rules are
> all contradicted by the electronics documentation.
>
> Kept for reference only. The governing documents for this project are:
> [`PROJECT_BRIEF_ELECTRONICS.md`](PROJECT_BRIEF_ELECTRONICS.md) § 8
>
> Reusable ECDOS modules in [`design-os/`](design-os/) are unedited and remain
> the quality standard.

---

# IMPLEMENTATION_PLAN.md — SOIRA

## Phase 0 — Audit and Setup
- Inspect existing files and versions.
- Scaffold Next.js App Router + TypeScript strict + Tailwind v4.
- Install only required dependencies: `next`, `react`, `react-dom`, `motion`, `lucide-react`.
- Configure `next/font` (Cormorant Garamond + Jost), metadata, design tokens and `next.config.ts` image patterns.
- Curate and centralise the placeholder image pool.

## Phase 1 — Foundations
- Root layout, providers, skip link
- Global styles and design tokens
- Container, Section, SectionHeader, Button, typography primitives
- AnnouncementBar, SiteHeader, DesktopNavigation, MegaMenu, MobileMenu, Footer
- Accessibility primitives: focus trap, scroll lock, media query, live region

## Phase 2 — Commerce Foundations
- `types/` product, navigation, cart, filters, editorial
- `data/` images, site, navigation, categories, collections, products, magazine, lookbook, size guide, search
- `lib/` price formatting, filtering, sorting, SEO helpers
- Store providers: cart, wishlist, recently viewed
- ProductCard, ProductGrid, ProductRail, ColorSwatch, SizeSelector, BraSizeSelector, QuantitySelector, WishlistButton, QuickAdd, ProductSkeleton
- SearchOverlay, CartDrawer, Toast

## Phase 3 — Homepage
Every required section with real Turkish copy and curated placeholder imagery.

## Phase 4 — Listing Experiences
- `/yeni-gelenler`, `/cok-satanlar` and all category routes through one shared catalogue shell
- `/koleksiyonlar` and `/koleksiyon/[slug]`
- Filters, sort, active chips, URL query sync, empty and loading states

## Phase 5 — Product Detail
- Gallery (desktop stack, mobile swipe + dots)
- Bra and standard size selection with disabled states
- Sticky purchase panel and mobile buy bar
- Accordions, size guide modal, complete-the-look, similar products, recently viewed
- Product JSON-LD placeholder

## Phase 6 — Remaining Routes
- `/sepet`, `/favoriler`, `/arama`, `/beden-rehberi`, `/hakkimizda`, `/magazin`, `/magazin/[slug]`, `not-found`

## Phase 7 — Polish
- Motion and reduced-motion pass
- Accessibility pass
- Responsive QA at 375 / 430 / 768 / 1024 / 1440 / 1728
- Performance pass
- Metadata, Open Graph, Twitter, canonical, JSON-LD placeholders, sitemap and robots
- `npm run lint`, `npm run typecheck`, `npm run build`

## Definition of Done
- All routes render without runtime or hydration errors.
- No TypeScript or ESLint errors.
- No layout shift on hover or image load.
- Navigation, search, filters, sorting, wishlist, cart and modals work as frontend demos.
- Cart and wishlist persist across reloads.
- Mobile and desktop both feel intentionally designed.
- The site does not resemble a default template.
