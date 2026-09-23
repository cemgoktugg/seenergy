# E-Commerce Design Operating System

# Module 04 — Typography System

---

## 1. Purpose

Typography is one of the strongest signals of brand quality.

It controls:

* visual hierarchy
* readability
* brand perception
* product desirability
* interface clarity
* editorial character
* conversion confidence

Typography must never be treated as decoration.

Every font size, weight, line height, letter spacing, and text width must serve a clear purpose.

---

## 2. Core Philosophy

The typography system must feel:

* refined
* modern
* confident
* calm
* editorial
* readable
* consistent

Typography should guide the user through the interface without requiring conscious effort.

The user must instantly understand:

1. What the page is about.
2. What information is important.
3. Which action should be taken.
4. Which content is secondary.

---

## 3. Typography Principles

### 3.1 Clarity Before Style

Typography must remain readable before it becomes expressive.

Never sacrifice usability for visual drama.

### 3.2 Hierarchy Before Decoration

Hierarchy must be created using:

* size
* weight
* spacing
* line height
* contrast
* placement

Do not rely only on bold text.

### 3.3 Restraint Creates Luxury

Premium interfaces use fewer typography variations.

Avoid unnecessary font sizes, random weights, and decorative text treatments.

### 3.4 Consistency Creates Trust

The same content type must always use the same typography style.

Examples:

* product titles
* prices
* labels
* buttons
* navigation items
* section headings
* captions

### 3.5 Typography Must Support Commerce

Typography must make products easier to understand and purchase.

It should clarify:

* product name
* product category
* price
* discount
* size
* availability
* delivery information
* actions

---

## 4. Font Architecture

Use a maximum of two font families.

### Primary Font

Used for:

* interface text
* navigation
* buttons
* product information
* filters
* forms
* utility content

Recommended character:

* modern
* neutral
* highly readable
* clean
* versatile

### Editorial Font

Used selectively for:

* hero headlines
* campaign titles
* editorial sections
* collection introductions
* brand storytelling

Recommended character:

* elegant
* distinctive
* expressive
* premium

### System Rule

Never use more than:

* 2 font families
* 6 font weights
* 10 primary text styles

Too many font combinations weaken the visual identity.

---

## 5. Recommended Font Combinations

### Option A — Modern Luxury

Primary:

```text
Inter
```

Editorial:

```text
Cormorant Garamond
```

Use when:

* fashion
* lingerie
* beauty
* jewelry
* premium lifestyle

### Option B — Minimal Contemporary

Primary:

```text
Manrope
```

Editorial:

```text
Playfair Display
```

Use when:

* modern fashion
* premium accessories
* minimalist commerce

### Option C — Editorial Fashion

Primary:

```text
Helvetica Neue
```

Editorial:

```text
Bodoni Moda
```

Use when:

* campaign-heavy fashion
* luxury collections
* editorial experiences

### Option D — Digital Premium

Primary:

```text
Geist
```

Editorial:

```text
DM Serif Display
```

Use when:

* modern digital commerce
* technology-inspired premium brands
* clean editorial layouts

---

## 6. Font Selection Rules

Choose fonts that support:

* Turkish characters
* currency symbols
* multilingual content
* numeric readability
* multiple font weights
* web font optimization
* variable font support where possible

Required Turkish characters include:

```text
ç ğ ı İ ö ş ü
```

Never select a typeface without verifying language support.

---

## 7. Font Weight Scale

Use a controlled weight system.

```text
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

Optional editorial weights:

```text
Light: 300
Extra Bold: 800
```

### Usage Rules

#### 300 — Light

Use only for:

* oversized editorial headlines
* decorative brand moments

Never use for:

* body copy
* product information
* mobile text
* small captions

#### 400 — Regular

Use for:

* body copy
* descriptions
* product titles
* supporting text
* navigation

#### 500 — Medium

Use for:

* labels
* navigation emphasis
* secondary buttons
* product options
* tabs

#### 600 — Semibold

Use for:

* primary buttons
* important prices
* section labels
* active navigation
* form actions

#### 700 — Bold

Use sparingly for:

* strong commercial emphasis
* promotional messaging
* critical titles

Luxury typography should not appear permanently bold.

---

## 8. Typography Scale

Use a modular type scale.

```text
12px
14px
16px
18px
20px
24px
30px
36px
48px
64px
80px
```

Avoid random values such as:

```text
15px
19px
27px
33px
41px
```

unless there is a documented design reason.

---

## 9. Core Typography Tokens

```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-md: 1.125rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 1.875rem;
  --font-size-3xl: 2.25rem;
  --font-size-4xl: 3rem;
  --font-size-5xl: 4rem;
  --font-size-6xl: 5rem;
}
```

Equivalent scale:

| Token | Size | Primary Use                 |
| ----- | ---: | --------------------------- |
| xs    | 12px | captions, labels            |
| sm    | 14px | secondary text              |
| base  | 16px | body text                   |
| md    | 18px | lead text                   |
| lg    | 20px | small headings              |
| xl    | 24px | section heading             |
| 2xl   | 30px | page heading                |
| 3xl   | 36px | campaign heading            |
| 4xl   | 48px | hero heading                |
| 5xl   | 64px | large editorial hero        |
| 6xl   | 80px | high-impact desktop display |

---

## 10. Line Height System

Use line height according to content type.

```text
Display: 0.95–1.05
Headline: 1.05–1.20
Subheading: 1.20–1.35
Body: 1.50–1.70
Caption: 1.35–1.50
Button: 1.00–1.20
```

### Examples

```css
--line-height-display: 1;
--line-height-heading: 1.15;
--line-height-body: 1.6;
--line-height-caption: 1.4;
--line-height-button: 1.1;
```

### Rules

Large headlines can use tighter line heights.

Small text requires more breathing room.

Never use the same line height for every text style.

---

## 11. Letter Spacing System

Letter spacing should support readability and character.

```text
Display Serif: -0.03em to -0.01em
Large Sans Heading: -0.02em
Body Text: 0em
Labels: 0.04em to 0.08em
Uppercase Labels: 0.08em to 0.14em
Buttons: 0.01em to 0.04em
```

Avoid excessive tracking.

Do not use large letter spacing in paragraph text.

---

## 12. Display Typography

Display typography is used for:

* hero headlines
* campaign launches
* premium collection names
* editorial statements

Desktop:

```text
48px–80px
```

Tablet:

```text
40px–56px
```

Mobile:

```text
34px–48px
```

### Display Rules

* Maximum 2–4 lines.
* Keep copy concise.
* Avoid long commercial descriptions.
* Use deliberate line breaks.
* Maintain strong contrast.
* Do not place display text over visually busy areas.

---

## 13. Hero Headline System

Recommended structure:

```text
Eyebrow
Hero headline
Supporting copy
Primary action
Secondary action
```

Example hierarchy:

```text
NEW COLLECTION

Designed for confidence.

Soft silhouettes, refined details and modern comfort.

Explore Collection
Discover the Story
```

Typography:

```text
Eyebrow: 12–14px / 600 / uppercase
Headline: 48–80px / 400–500
Supporting: 16–20px / 400
Button: 14–16px / 500–600
```

---

## 14. Page Heading System

Page headings are used for:

* category pages
* search results
* editorial pages
* account pages
* campaign landing pages

Desktop:

```text
36px–48px
```

Mobile:

```text
30px–38px
```

Recommended supporting text:

```text
16px–18px
```

Do not use oversized display text on functional pages without purpose.

---

## 15. Section Heading System

Section headings should clearly introduce content.

Structure:

```text
Optional eyebrow
Section heading
Optional supporting text
```

Recommended values:

```text
Eyebrow: 12–14px
Heading: 24–36px
Supporting text: 16–18px
```

Spacing:

```text
Eyebrow to heading: 8–12px
Heading to description: 12–16px
Description to content: 24–40px
```

---

## 16. Body Typography

Default body text:

```text
16px
Line height: 1.55–1.70
Weight: 400
```

Minimum desktop body size:

```text
16px
```

Minimum mobile body size:

```text
15px
```

Preferred mobile size:

```text
16px
```

### Paragraph Width

Ideal line length:

```text
55–75 characters
```

Maximum comfortable content width:

```text
680–760px
```

Long text blocks should never stretch across the full screen.

---

## 17. Product Card Typography

Recommended hierarchy:

```text
Brand or category
Product name
Variant or color
Price
Discount information
```

Typography:

```text
Brand/category: 12–13px / 500
Product name: 14–16px / 400–500
Variant: 13–14px / 400
Price: 14–16px / 500–600
Old price: 13–15px / 400
Discount label: 12–13px / 600
```

### Rules

* Product title should normally use a maximum of two lines.
* Avoid excessively bold product names.
* Price must be immediately scannable.
* Old price should not overpower the current price.
* Discount labels must remain visually restrained.

---

## 18. Product Detail Typography

Recommended hierarchy:

```text
Brand
Product name
Rating
Price
Installment information
Description
Color
Size
Stock information
Delivery information
```

Suggested values:

```text
Brand: 12–14px / 500
Product name: 28–40px / 400–500
Price: 20–28px / 500–600
Supporting text: 14–16px / 400
Options label: 13–14px / 600
Description: 15–17px / 400
Delivery text: 13–15px / 400–500
```

### Rules

Product title and price must remain visually close.

Do not separate critical purchase information with excessive whitespace.

---

## 19. Price Typography

Prices are commercial information and require precision.

Use tabular numerals when available:

```css
font-variant-numeric: tabular-nums;
```

Recommended format:

```text
₺2.490
€89,90
$120.00
```

Use locale-aware formatting.

### Price Hierarchy

Current price:

```text
Medium or semibold
High contrast
```

Old price:

```text
Regular
Lower contrast
Strikethrough
```

Discount percentage:

```text
Small
Semibold
Controlled accent color
```

Do not use oversized red prices unless the brand is discount-oriented.

---

## 20. Navigation Typography

Desktop navigation:

```text
14–16px
Weight: 400–500
```

Mobile navigation:

```text
18–24px
Weight: 400–500
```

Utility navigation:

```text
12–14px
```

### Navigation Rules

* Avoid uppercase for all navigation items.
* Active state must be clear.
* Navigation must remain readable at all breakpoints.
* Do not use decorative fonts in menus.

---

## 21. Button Typography

Primary button:

```text
14–16px
Weight: 500–600
Letter spacing: 0.01em–0.03em
```

Small button:

```text
13–14px
```

Large commerce action:

```text
15–17px
```

### Rules

* Button labels should use clear verbs.
* Avoid long sentences.
* Never use tiny text on primary purchase actions.
* Do not rely on uppercase to create importance.

Preferred examples:

```text
Sepete Ekle
Koleksiyonu Keşfet
Bedenimi Bul
Alışverişe Devam Et
```

Avoid:

```text
TIKLAYINIZ
BURADAN SATIN AL
DAHA FAZLA BİLGİ İÇİN TIKLAYIN
```

---

## 22. Form Typography

Form label:

```text
13–14px
Weight: 500–600
```

Input text:

```text
16px
Weight: 400
```

Placeholder:

```text
15–16px
Lower contrast
```

Helper text:

```text
12–14px
```

Error text:

```text
12–14px
Weight: 500
```

### Mobile Rule

Input text must be at least:

```text
16px
```

This prevents unwanted browser zoom behavior on mobile devices.

---

## 23. Label Typography

Use labels for:

* product attributes
* filters
* badges
* metadata
* categories
* editorial context

Recommended values:

```text
12–14px
Weight: 500–600
```

Uppercase labels may use:

```text
Letter spacing: 0.08em–0.12em
```

Do not use uppercase labels for long content.

---

## 24. Badge Typography

Examples:

* New
* Bestseller
* Limited
* Online Exclusive
* Low Stock

Typography:

```text
11–13px
Weight: 600
Line height: 1
```

Badges must remain concise.

Avoid writing full sentences inside badges.

---

## 25. Caption Typography

Captions are used for:

* image descriptions
* campaign information
* secondary metadata
* editorial credits

Recommended:

```text
12–14px
Line height: 1.4–1.5
Weight: 400
```

Caption text must remain readable and should not use extremely low contrast.

---

## 26. Editorial Content Typography

Editorial pages may use a more expressive system.

Recommended hierarchy:

```text
Article category
Title
Introduction
Author and date
Body
Pull quote
Caption
Related content
```

Article title:

```text
40–64px desktop
32–44px mobile
```

Introduction:

```text
18–22px
Line height: 1.5
```

Article body:

```text
17–19px
Line height: 1.7
```

Pull quote:

```text
28–40px
Editorial font
```

---

## 27. Responsive Typography

Typography must scale gradually.

Avoid abrupt changes between breakpoints.

Use fluid sizing where appropriate:

```css
font-size: clamp(2.5rem, 6vw, 5rem);
```

Example:

```css
.hero-title {
  font-size: clamp(2.75rem, 6vw, 5rem);
  line-height: 1;
}
```

### Responsive Rules

* Large display text must reduce on mobile.
* Body text should remain stable.
* Buttons must stay readable.
* Long headings should wrap intentionally.
* Avoid single words creating isolated lines.
* Test real Turkish product names.

---

## 28. Fluid Type Scale

Suggested implementation:

```css
.text-display {
  font-size: clamp(3rem, 7vw, 5rem);
}

.text-page-title {
  font-size: clamp(2.25rem, 4.5vw, 3rem);
}

.text-section-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
}

.text-body-lg {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
}
```

Fluid typography should never produce excessively small or large text.

Always define minimum and maximum values.

---

## 29. Mobile Typography Rules

Mobile interfaces require stronger discipline.

### Required Rules

* Body text must remain readable.
* Product price must not be compressed.
* Buttons must use clear labels.
* Headings should not exceed four lines.
* Avoid tiny captions.
* Increase line height for long content.
* Do not shrink desktop typography mechanically.
* Allow sufficient spacing between text groups.

### Mobile Hero

Recommended:

```text
Eyebrow: 12px
Headline: 36–48px
Supporting: 16–18px
Buttons: 15–16px
```

---

## 30. Text Contrast

Typography must meet accessibility requirements.

Recommended minimums:

```text
Normal text: 4.5:1
Large text: 3:1
```

Large text is generally:

```text
24px regular
18.66px bold
```

Never use extremely light gray text for important information.

Critical commerce information must always have strong contrast.

---

## 31. Text Truncation

Use truncation carefully.

Product cards:

```text
Maximum 2 lines
```

Navigation:

```text
Do not truncate primary navigation unless unavoidable
```

Search results:

```text
Preserve important matching words
```

Avoid truncating:

* prices
* sizes
* stock status
* delivery dates
* legal information
* error messages

---

## 32. Capitalization Rules

Use sentence case by default.

Preferred:

```text
Yeni koleksiyonu keşfet
Sepete ekle
Beden rehberi
```

Avoid unnecessary title case:

```text
Yeni Koleksiyonu Keşfet
Sepete Ekle
Beden Rehberi
```

Uppercase is permitted for:

* short labels
* categories
* editorial eyebrows
* limited badges

Never use uppercase for long paragraphs.

---

## 33. Numeric Typography

Numbers must remain clear and aligned.

Use tabular numerals for:

* prices
* order totals
* quantities
* analytics
* stock values
* countdowns

Use proportional numerals for:

* editorial writing
* marketing content
* natural sentences

---

## 34. Currency Typography

Currency symbols must remain visually attached to values.

Correct:

```text
₺2.490
€89,90
```

Avoid awkward spacing:

```text
₺ 2.490
89,90 €
```

unless local conventions require it.

Use locale-sensitive currency formatting.

---

## 35. Discount Typography

Discount communication must remain premium.

Preferred:

```text
%20 indirim
Seçili ürünlerde
```

Avoid:

```text
ÇILGIN İNDİRİM
ŞOK FİYAT
SON FIRSAT
KAÇIRMAYIN
```

unless the brand explicitly uses promotional retail language.

---

## 36. Typography and Motion

Text animation should remain subtle.

Allowed:

* opacity fade
* slight vertical reveal
* line-by-line reveal
* controlled mask reveal

Avoid:

* rotating text
* bouncing letters
* excessive character animation
* random stagger effects
* continuous movement

Text animation must never reduce readability.

---

## 37. Typography Performance

Optimize font delivery.

Required practices:

* use WOFF2
* preload critical fonts
* limit font weights
* use variable fonts where beneficial
* use `font-display: swap`
* self-host fonts when appropriate
* avoid loading unused character sets

Example:

```css
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

---

## 38. Fallback Fonts

Always define a reliable fallback stack.

Sans-serif:

```css
font-family:
  "Brand Sans",
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Serif:

```css
font-family:
  "Brand Serif",
  Georgia,
  "Times New Roman",
  serif;
```

Fallback fonts should have similar visual proportions where possible.

---

## 39. Font Loading Rules

Critical font:

```text
Load immediately
```

Editorial font:

```text
Load only where used
```

Do not load:

* unused italics
* unused weights
* complete font families with 12 variations
* fonts used on only one hidden component

Font loading must not delay meaningful page rendering.

---

## 40. Tailwind Typography Tokens

Example configuration:

```ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        editorial: ["Cormorant Garamond", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.15" }],
        "5xl": ["3rem", { lineHeight: "1.05" }],
        "6xl": ["4rem", { lineHeight: "1" }],
        "7xl": ["5rem", { lineHeight: "0.95" }],
      },
    },
  },
};
```

---

## 41. Typography Component Tokens

Recommended semantic classes:

```text
text-display
text-hero
text-page-title
text-section-title
text-card-title
text-product-title
text-product-price
text-body
text-body-small
text-label
text-caption
text-button
```

Avoid using raw font sizes everywhere.

Bad:

```tsx
<h2 className="text-[31px] font-medium">
```

Preferred:

```tsx
<h2 className="text-section-title">
```

Semantic typography improves consistency.

---

## 42. Do Examples

### Do

* Use clear hierarchy.
* Keep body text readable.
* Limit typography styles.
* Use large headings selectively.
* Use restrained font weights.
* Optimize font loading.
* Test Turkish characters.
* Maintain consistent product typography.
* Use semantic text tokens.
* Use tabular numerals for prices.
* Support responsive type scaling.

---

## 43. Don’t Examples

### Don’t

* Use five different fonts.
* Mix random font sizes.
* Use light text on light backgrounds.
* Make all text bold.
* Use uppercase everywhere.
* Use tiny body text.
* Load unnecessary font weights.
* Stretch paragraphs across the page.
* Use decorative fonts for forms.
* Animate every word.
* Use inconsistent product price styles.
* shrink typography until content fits.

---

## 44. Typography Acceptance Criteria

A page is approved only if:

* hierarchy is immediately understandable
* body text is readable
* product prices are scannable
* heading scale is consistent
* mobile typography is tested
* Turkish characters display correctly
* font loading is optimized
* contrast requirements are met
* paragraph width is controlled
* buttons remain readable
* form text is clear
* no random font sizes exist
* no unnecessary weights are loaded
* semantic typography tokens are used

---

## 45. AI Implementation Rules

When an AI agent creates or modifies a page, it must:

1. Use existing typography tokens.
2. Avoid introducing new font sizes without justification.
3. Preserve heading hierarchy.
4. Check mobile wrapping.
5. Test long Turkish product names.
6. Use correct price formatting.
7. Maintain accessible contrast.
8. Verify font loading performance.
9. Avoid excessive bold typography.
10. Complete the typography review checklist.

---

## 46. Self-Review Checklist

Before finalizing typography, verify:

```text
[ ] Are only approved font families used?

[ ] Are font sizes selected from the type scale?

[ ] Is the hierarchy immediately clear?

[ ] Are line heights appropriate?

[ ] Is body copy comfortable to read?

[ ] Are paragraphs within readable widths?

[ ] Are prices aligned and easy to scan?

[ ] Are product titles limited correctly?

[ ] Is mobile typography tested?

[ ] Are headings intentionally wrapped?

[ ] Are Turkish characters supported?

[ ] Are uppercase labels used sparingly?

[ ] Is contrast accessible?

[ ] Are critical fonts optimized?

[ ] Are unused weights removed?

[ ] Are semantic typography tokens used?

[ ] Does the page feel calm and premium?

[ ] Does typography support commerce?

[ ] Is the typography consistent across pages?
```

---

## 47. Final Principle

Typography should never feel like a collection of font sizes.

It should feel like one coherent language.

A premium typography system is created through:

* restraint
* rhythm
* hierarchy
* readability
* consistency
* precision

When uncertain:

```text
Reduce variation.

Strengthen hierarchy.

Improve readability.

Preserve consistency.
```
