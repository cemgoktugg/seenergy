# PROJECT_BRIEF_ELECTRONICS.md

## VOLTA — Modern Electronics Commerce Frontend

---

## 1. What this document is

This brief and its five siblings extend the **E-Commerce Design Operating System**
(`docs/design-os/`) for an electronics storefront. ECDOS defines *quality*. These
documents define *this brand and this category*.

| Document | Defines |
| --- | --- |
| `PROJECT_BRIEF_ELECTRONICS.md` | Scope, stack, audience, success criteria |
| `BRAND_BIBLE_ELECTRONICS.md` | Identity, palette, typography, voice |
| `COMMERCE_RULES_ELECTRONICS.md` | Cards, badges, stock, compare, B2B, filters |
| `CONTENT_GUIDE_ELECTRONICS.md` | Turkish copy rules, terminology, claims policy |
| `PRODUCT_MODEL_ELECTRONICS.md` | Types, variants, specs, images, mock-data rules |
| `INFORMATION_ARCHITECTURE_ELECTRONICS.md` | Categories, routes, navigation, search |

### Precedence

1. `docs/design-os/01-brand-bible.md` — permanent quality identity
2. These six electronics documents — category and brand specialisation
3. Later ECDOS modules (02–15) for the specifics they cover
4. Implementation detail in code

**ECDOS modules are not edited.** Where a module's *examples* are lingerie- or
fashion-specific, the rule behind the example is preserved and the example is
replaced. Every such substitution is recorded in the table at
`COMMERCE_RULES_ELECTRONICS.md` §13.

The final audit against Modules 14 and 15 is in `QA_REPORT_ELECTRONICS.md`,
including what was verified, what was fixed during the audit, and what this
build cannot claim.

---

## 2. Scope

**Frontend only.** Next.js App Router, TypeScript (strict), Tailwind CSS v4,
React Server Components by default.

### In scope

- Complete storefront UI: home, category, product, search, cart, wishlist,
  compare, brands, campaigns, B2B, editorial, supporting pages
- Strongly typed mock catalogue that mirrors a real commerce schema
- Frontend state for cart, wishlist, compare, recently viewed, search history
- Metadata, canonical URLs, JSON-LD, sitemap, robots
- Accessibility, responsive, motion and performance work to ECDOS standard

### Explicitly out of scope

- Backend, database, CMS
- Payment provider, real checkout
- Authentication provider
- Live inventory or pricing API
- Order management

Checkout is a **demo boundary**: the cart page ends at a clearly labelled
non-functional step. No fake order confirmation is produced.

### Dependency budget

`next`, `react`, `react-dom`, `lucide-react`. Nothing else reaches the client
bundle. No animation library, no carousel library, no state-management library,
no search library. ECDOS 12 §47 and §129 require every dependency to justify
itself against CSS and browser APIs first:

| Need | Solution instead of a package |
| --- | --- |
| Rails / carousels | `overflow-x` + `scroll-snap` (12 §63/§64) |
| Enter/exit animation | CSS transitions + `@starting-style` (12 §50) |
| Global state | `useSyncExternalStore` over a small store module |
| Search | `useMemo` over the local catalogue (07C recorded decision) |
| Filtering | Pure functions in `lib/catalog.ts` |

---

## 3. Business model

The reference business (Merter Elektronik) serves two customers from one
catalogue. The frontend must serve both without becoming two products.

### B2C — consumer

Buys a Bluetooth speaker, a car head unit, a Wi-Fi camera, a phone charger.
Needs: clear pictures, understandable specifications, price, availability,
delivery, returns, warranty.

### B2B — professional, installer, dealer, wholesale

Buys satellite headends, CCTV kits, power supplies, LED profile, test
instruments, components — often in quantity, often for a project.
Needs: exact model and SKU, technical specifications, compatibility,
datasheets, quantity pricing enquiry, dealer terms.

**Design consequence:** the consumer path is the default surface, and the
professional path is *one deliberate click away at every level* — a "Toptan
Satış" entry in the utility bar, a "Profesyoneller İçin" homepage section,
a technical specification block on every product, and a
`/toptan-satis · /bayi-basvurusu · /kurumsal` route family. B2B is never a
separate skin, only a deeper layer of the same catalogue.

All B2B forms are **frontend demos**. They validate, announce success locally,
and state plainly that no submission occurs.

---

## 4. Audience

| Segment | Entry point | Decisive information |
| --- | --- | --- |
| Consumer, knows what they want | Search, category | Price, stock, shipping |
| Consumer, browsing | Home, category cards | Imagery, key specs, badges |
| Consumer, comparing | Compare tray | Side-by-side specifications |
| Technician, has a model number | Search (SKU/model) | Exact match, datasheet |
| Installer, project buying | Category + filters | Spec filters, stock, bulk |
| Dealer | Utility bar → Toptan | Terms, application, contact |

Search carries a disproportionate share of this. A technician typing
`PM-27447` or `12v 2a adaptör` must land on the right product immediately.
Module 11 of the master prompt is treated as a P0 requirement, not a feature.

---

## 5. Design direction

**Modern tech retail.** Precise, calm, information-rich, product-led.

Not: gaming, cyberpunk, SaaS dashboard, marketplace grid, wholesaler catalogue
dump, generic Tailwind template.

Quality benchmarks (principles only, never copied): Apple for restraint and
hierarchy, B&H for technical discovery, Best Buy for commerce clarity,
MediaMarkt for commercial usability.

The single most important visual rule inherited from ECDOS 05 §3 and adapted:
**product imagery is dominant, the interface is quiet.** Electronics photography
is usually a product on a neutral field — so the surrounding UI must be quieter
still, and the *information* becomes the texture.

---

## 6. Neutral temperature

ECDOS 05 §8 assigns cool neutrals to electronics explicitly. This build uses a
cool-grey neutral ramp throughout. Warm neutrals are not mixed in.

---

## 7. Success criteria

### Homepage, first 3 seconds
The visitor understands this is a serious electronics company, not a reseller.

### Homepage, first 10 seconds
The visitor believes almost any electronics product can be found here — because
the category architecture and the search field both say so.

### Homepage, first 30 seconds
Search feels excellent. Categories are legible. Products look trustworthy. The
professional range is visible.

### Product page
Within one screen: what it is, who makes it, which model, how much, whether it
is available. Within one scroll: whether it will work for the customer.

### Engineering
`npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass
clean. No hydration warnings. No horizontal overflow at 320px. Full keyboard
path from homepage to cart.

---

## 8. Implementation order

Executed in this sequence, each phase complete before the next:

1. Repository and ECDOS audit
2. Electronics documentation (this set)
3. Design tokens, types, mock catalogue
4. Header, search, mega menu, mobile navigation, footer
5. Homepage
6. Category / PLP with the electronics filter system
7. Product detail and the specification system
8. Search, cart, wishlist, comparison
9. B2B, brands, editorial, supporting pages
10. Responsive audit · 11. Accessibility audit · 12. Motion polish
13. Performance audit · 14. SEO audit · 15. Final QA (ECDOS 14)

The audit phases are recorded in `docs/QA_REPORT_ELECTRONICS.md`.
