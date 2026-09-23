# E-Commerce Design Operating System

# Module 05 — Color System

---

## 1. Purpose

Color is a functional design system, not decoration.

It controls:

* brand recognition
* visual hierarchy
* product focus
* readability
* action priority
* emotional perception
* accessibility
* trust
* commerce clarity

Every color must have a defined role.

No color should enter the interface without a documented purpose.

---

## 2. Core Philosophy

The color system must feel:

* premium
* restrained
* calm
* modern
* timeless
* product-focused
* accessible
* consistent

Luxury is not created by using more colors.

Luxury is created by using fewer colors with greater precision.

---

## 3. Primary Principle

Products must remain the strongest visual element.

The interface should support product imagery rather than compete with it.

For fashion, lingerie, beauty, jewelry, furniture, and other image-led categories:

* UI colors should remain mostly neutral.
* Accent colors should be used selectively.
* Product photography should provide most visual richness.
* Promotional colors should never overpower the brand.

---

## 4. Color Architecture

The system consists of seven layers:

```text
1. Brand colors
2. Neutral colors
3. Surface colors
4. Text colors
5. Border colors
6. Semantic colors
7. Interactive colors
```

Each layer has a different responsibility.

Do not use brand colors as replacements for semantic colors.

Do not use semantic colors as decoration.

---

## 5. Brand Color System

Brand colors express identity.

Recommended structure:

```text
Brand Primary
Brand Secondary
Brand Accent
Brand Soft
Brand Strong
```

### Brand Primary

Used for:

* primary brand expression
* selected states
* important brand moments
* controlled calls to action
* logo support

### Brand Secondary

Used for:

* supporting sections
* editorial moments
* subtle contrast
* secondary campaigns

### Brand Accent

Used sparingly for:

* small emphasis
* selected badges
* limited campaign highlights
* focus details

### Brand Soft

A light tint used for:

* gentle backgrounds
* editorial cards
* collection introductions
* selected states

### Brand Strong

A darker tone used for:

* high-contrast text
* premium dark sections
* controlled emphasis

---

## 6. Recommended Luxury Palette Direction

For premium lingerie and fashion commerce, a refined palette may use:

```text
Warm Ivory
Soft Sand
Muted Blush
Deep Cocoa
Soft Charcoal
Warm White
```

Example conceptual palette:

| Role            | Example       |
| --------------- | ------------- |
| Brand Primary   | Muted Rose    |
| Brand Secondary | Warm Taupe    |
| Brand Accent    | Deep Berry    |
| Brand Soft      | Pale Blush    |
| Brand Strong    | Deep Cocoa    |
| Base Surface    | Warm Ivory    |
| Main Text       | Soft Charcoal |

The exact palette should be finalized for each brand.

---

## 7. Neutral Color System

Neutral colors form the foundation of premium commerce.

Recommended neutral scale:

```text
Neutral 0
Neutral 50
Neutral 100
Neutral 200
Neutral 300
Neutral 400
Neutral 500
Neutral 600
Neutral 700
Neutral 800
Neutral 900
Neutral 950
```

Example warm-neutral direction:

```css
:root {
  --neutral-0: #ffffff;
  --neutral-50: #faf9f7;
  --neutral-100: #f5f3ef;
  --neutral-200: #e9e5df;
  --neutral-300: #d7d1c9;
  --neutral-400: #aaa39a;
  --neutral-500: #7d766e;
  --neutral-600: #5d5751;
  --neutral-700: #45403b;
  --neutral-800: #302c29;
  --neutral-900: #211e1c;
  --neutral-950: #151311;
}
```

These values are examples and must be adjusted to the selected brand palette.

---

## 8. Warm vs Cool Neutrals

Choose one dominant neutral temperature.

### Warm Neutrals

Best suited for:

* lingerie
* fashion
* beauty
* home
* jewelry
* wellness
* lifestyle

They feel:

* intimate
* human
* elegant
* soft
* premium

### Cool Neutrals

Best suited for:

* electronics
* performance products
* technical fashion
* modern furniture
* digital luxury

They feel:

* precise
* clean
* modern
* technical

Do not mix warm and cool neutral systems randomly.

---

## 9. Surface Color System

Surfaces establish depth and page structure.

Recommended semantic surface tokens:

```text
Surface Base
Surface Raised
Surface Subtle
Surface Muted
Surface Inverse
Surface Brand
Surface Disabled
Surface Overlay
```

Example:

```css
:root {
  --surface-base: var(--neutral-0);
  --surface-raised: var(--neutral-0);
  --surface-subtle: var(--neutral-50);
  --surface-muted: var(--neutral-100);
  --surface-inverse: var(--neutral-900);
  --surface-disabled: var(--neutral-100);
  --surface-overlay: rgb(21 19 17 / 55%);
}
```

---

## 10. Surface Hierarchy

Use surfaces to create structure without heavy shadows.

Recommended hierarchy:

```text
Page background
↓
Section background
↓
Card or drawer surface
↓
Modal surface
↓
Floating utility surface
```

Do not create depth using random gray values.

Use documented surface tokens.

---

## 11. Text Color System

Recommended semantic text tokens:

```text
Text Primary
Text Secondary
Text Tertiary
Text Inverse
Text Brand
Text Disabled
Text Error
Text Success
Text Warning
```

Example:

```css
:root {
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-500);
  --text-inverse: var(--neutral-0);
  --text-disabled: var(--neutral-400);
}
```

### Rules

Primary text must always have strong contrast.

Secondary text may be softer but must remain readable.

Tertiary text should only be used for non-critical metadata.

Never use low-contrast text for:

* prices
* stock information
* delivery dates
* form labels
* errors
* payment information
* primary navigation

---

## 12. Border Color System

Borders should create structure quietly.

Recommended tokens:

```text
Border Subtle
Border Default
Border Strong
Border Interactive
Border Focus
Border Error
Border Success
```

Example:

```css
:root {
  --border-subtle: var(--neutral-100);
  --border-default: var(--neutral-200);
  --border-strong: var(--neutral-400);
  --border-interactive: var(--neutral-700);
}
```

### Rules

Use subtle borders for:

* cards
* dividers
* form fields
* accordions
* drawers

Use stronger borders for:

* active selections
* focused fields
* selected product options
* critical hierarchy

Do not use dark borders around every component.

---

## 13. Semantic Color System

Semantic colors communicate system state.

Required categories:

```text
Success
Warning
Error
Information
```

Each category should include:

```text
Background
Border
Text
Strong
Soft
```

Example structure:

```css
:root {
  --success-soft: #edf7f0;
  --success-default: #2f7d4b;
  --success-strong: #1f5c36;

  --warning-soft: #fff7e6;
  --warning-default: #a86800;
  --warning-strong: #744800;

  --error-soft: #fff0f0;
  --error-default: #b93838;
  --error-strong: #812626;

  --info-soft: #eef5ff;
  --info-default: #3268a8;
  --info-strong: #244d7c;
}
```

These values are examples only.

---

## 14. Semantic Color Rules

Success is used for:

* successful order confirmation
* applied discount
* saved changes
* available stock
* payment success

Warning is used for:

* low stock
* delayed delivery
* incomplete information
* limited availability

Error is used for:

* invalid form input
* failed payment
* unavailable option
* system failure
* destructive action

Information is used for:

* delivery details
* size guidance
* product care notes
* account notifications

Never use semantic colors as decorative accents.

---

## 15. Commerce-Specific Colors

Commerce requires additional semantic roles.

Recommended tokens:

```text
Price Current
Price Previous
Price Discount
Stock Available
Stock Low
Stock Unavailable
Delivery Positive
Promotion
Loyalty
```

Example:

```css
:root {
  --price-current: var(--text-primary);
  --price-previous: var(--text-tertiary);
  --price-discount: var(--error-default);

  --stock-available: var(--success-default);
  --stock-low: var(--warning-default);
  --stock-unavailable: var(--error-default);
}
```

---

## 16. Price Color Rules

Current price:

* high contrast
* usually neutral
* semibold or medium

Old price:

* lower contrast
* strikethrough
* never more prominent than current price

Discount:

* controlled semantic color
* not necessarily bright red
* brand-appropriate intensity

Premium brands should avoid excessive red price treatment.

---

## 17. Promotion Color Rules

Promotional colors should support urgency without damaging the premium identity.

Use promotion color for:

* limited campaign labels
* seasonal offers
* selected markdowns
* special access events

Avoid:

* full-page bright red sections
* flashing promotional banners
* multiple competing sale colors
* neon discount labels
* aggressive urgency styling

The promotion should feel intentional, not desperate.

---

## 18. Interactive Color System

Interactive states must be defined for:

```text
Default
Hover
Active
Focus
Selected
Disabled
Visited
```

These states apply to:

* buttons
* links
* tabs
* product options
* filters
* navigation
* icons
* cards
* controls

---

## 19. Primary Button Color

Recommended tokens:

```text
Button Primary Background
Button Primary Text
Button Primary Hover
Button Primary Active
Button Primary Disabled
```

Example:

```css
:root {
  --button-primary-bg: var(--neutral-900);
  --button-primary-text: var(--neutral-0);
  --button-primary-hover: var(--neutral-800);
  --button-primary-active: var(--neutral-950);
  --button-primary-disabled: var(--neutral-300);
}
```

A premium commerce primary button often works best in a high-contrast neutral rather than a bright brand color.

---

## 20. Secondary Button Color

Recommended:

```css
:root {
  --button-secondary-bg: transparent;
  --button-secondary-text: var(--neutral-900);
  --button-secondary-border: var(--neutral-300);
  --button-secondary-hover: var(--neutral-50);
}
```

Secondary buttons should never compete with the primary action.

---

## 21. Tertiary Button and Text Link Colors

Tertiary actions may use:

* transparent background
* no border
* text emphasis
* underline or subtle motion

Recommended states:

```text
Default
Hover
Active
Focus
Disabled
```

Links should be distinguishable without relying exclusively on color.

---

## 22. Selected State Colors

Selected states must be clear for:

* size
* color
* filters
* tabs
* shipping methods
* payment methods
* product variants

Recommended approach:

```text
Selected border
Selected text
Optional selected background
Optional checkmark
```

Do not rely only on a small color change.

Use at least two indicators when possible.

---

## 23. Focus Color System

Focus states are essential for keyboard navigation.

Recommended:

```css
:root {
  --focus-ring: #4d72b8;
  --focus-ring-offset: var(--surface-base);
}
```

Focus ring requirements:

* visible on all surfaces
* minimum 2px thickness
* sufficient contrast
* not removed
* consistent across controls

Do not use the same focus color if it disappears against the background.

---

## 24. Color Swatches

Product color swatches require special treatment.

Each swatch should support:

* visible boundary
* selected state
* unavailable state
* accessible label
* keyboard focus
* tooltip or visible name

Light-colored swatches need a border.

Dark swatches require a visible selection ring.

Patterned or multicolor products may use:

* thumbnail swatches
* texture previews
* split-color swatches

Never use color swatches without text alternatives.

---

## 25. Product Image Background Colors

Product imagery should use consistent background logic.

Recommended options:

```text
Warm white
Soft neutral
Editorial environmental image
Transparent cutout on neutral surface
```

Do not mix:

* pure white
* blue-gray
* beige
* black
* heavily edited backgrounds

inside the same product grid without an intentional merchandising strategy.

---

## 26. Image and UI Color Balance

When photography is colorful:

* simplify the surrounding UI
* use neutral section backgrounds
* reduce accent usage
* preserve image prominence

When photography is monochromatic:

* controlled brand color may add warmth
* subtle tinted surfaces may create depth
* accent moments may become slightly stronger

UI color intensity should react to the visual intensity of the imagery.

---

## 27. Editorial Section Colors

Editorial sections may use:

* brand-soft backgrounds
* inverse dark sections
* muted seasonal tones
* monochrome treatments

Rules:

* maintain readable contrast
* preserve product clarity
* avoid excessive palette changes
* use color transitions intentionally
* do not create a patchwork homepage

A premium homepage should feel composed, not segmented by random colors.

---

## 28. Dark Section System

Dark sections can add premium depth.

Recommended uses:

* campaign storytelling
* footer
* editorial video
* selected product launches
* premium membership
* high-impact brand moments

Dark section tokens:

```css
:root {
  --dark-surface: var(--neutral-900);
  --dark-surface-raised: var(--neutral-800);
  --dark-text-primary: var(--neutral-0);
  --dark-text-secondary: var(--neutral-300);
  --dark-border: var(--neutral-700);
}
```

Do not use pure black unless it matches the brand.

Soft near-black tones usually feel more refined.

---

## 29. Dark Mode

Dark mode is separate from using dark editorial sections.

A complete dark mode requires remapping:

* surfaces
* text
* borders
* controls
* images
* shadows
* focus rings
* semantic colors

Example:

```css
[data-theme="dark"] {
  --surface-base: #151311;
  --surface-raised: #211e1c;
  --surface-subtle: #2b2724;

  --text-primary: #f7f4ef;
  --text-secondary: #c8c1b8;
  --text-tertiary: #9f978e;

  --border-subtle: #302c29;
  --border-default: #45403b;
}
```

Dark mode must not be created by simply inverting colors.

---

## 30. Dark Mode Product Photography

Product images may need special handling in dark mode.

Consider:

* maintaining original light product backgrounds
* using framed image surfaces
* preventing transparent dark products from disappearing
* adding subtle neutral containers
* preserving accurate product color

Never recolor product photography automatically.

Product color accuracy is more important than theme purity.

---

## 31. Accessibility Contrast

Minimum contrast requirements:

```text
Normal text: 4.5:1
Large text: 3:1
UI components and meaningful graphics: 3:1
```

Large text generally means:

```text
24px regular
18.66px bold
```

Critical commerce information should often exceed minimum requirements.

This includes:

* prices
* totals
* delivery details
* stock
* checkout actions
* payment errors
* form labels

---

## 32. Contrast Levels

Recommended internal quality targets:

```text
Primary body text: 7:1 preferred
Secondary text: 4.5:1 minimum
Large decorative text: 3:1 minimum
Interactive boundaries: 3:1 minimum
Focus rings: 3:1 minimum
```

Passing minimum contrast is not always enough.

The interface must remain comfortable in real-world lighting conditions.

---

## 33. Color Must Not Be the Only Signal

Never communicate state using color alone.

Examples:

Unavailable size:

* muted color
* strike-through
* disabled cursor
* accessibility state

Form error:

* error color
* icon
* descriptive message
* `aria-invalid`

Selected filter:

* background
* border
* checkmark
* state label

Low stock:

* warning color
* explicit text

---

## 34. Disabled States

Disabled states must remain identifiable.

Recommended:

```text
Reduced contrast
Muted surface
Muted border
Disabled cursor
No hover response
```

Disabled text must still remain readable.

Avoid making disabled controls nearly invisible.

When possible, explain why an action is unavailable.

---

## 35. Overlay Color System

Overlays are used for:

* modals
* drawers
* image text
* navigation
* lightboxes

Recommended tokens:

```css
:root {
  --overlay-light: rgb(255 255 255 / 72%);
  --overlay-dark: rgb(21 19 17 / 52%);
  --overlay-strong: rgb(21 19 17 / 72%);
}
```

Overlay strength should depend on:

* image complexity
* text contrast
* interaction priority
* depth

Do not use heavy black overlays on every image.

---

## 36. Text Over Images

Text over photography must be tested on the actual image.

Solutions:

* image-aware crop
* gradient overlay
* text shadow used minimally
* solid text panel
* alternate text placement
* different image for mobile

Never assume white text will remain readable on every image.

---

## 37. Gradient System

Gradients must be controlled.

Appropriate uses:

* image readability overlays
* subtle surface transitions
* editorial campaign moments
* soft lighting effects

Avoid:

* rainbow gradients
* heavy SaaS-style backgrounds
* multiple competing gradients
* decorative gradients behind every card

Luxury gradients should be nearly invisible.

---

## 38. Seasonal Color Layer

Seasonal campaigns may introduce temporary colors.

Examples:

* spring blush
* summer sand
* winter berry
* festive deep green

Rules:

* seasonal colors must not replace core tokens
* they should use separate campaign tokens
* core navigation and commerce states remain stable
* campaign colors must pass contrast standards
* seasonal additions must have an expiration plan

Example:

```css
:root {
  --campaign-primary: #8d4a5c;
  --campaign-soft: #f5e9ec;
}
```

---

## 39. Category Color Usage

Avoid assigning a different strong color to every category.

This can make the site feel like a marketplace.

Better approach:

* shared neutral UI
* category-specific photography
* subtle editorial tint
* occasional campaign accent

Color should unify the brand, not fragment it.

---

## 40. Gendered Color Assumptions

Do not automatically use:

* pink for women
* blue for men
* black and gold for luxury

Brand strategy should determine color.

Premium design should avoid clichés unless used intentionally.

For lingerie, soft blush may be appropriate, but it should not become the only expression of femininity.

---

## 41. Cultural and International Considerations

Colors can carry different meanings across markets.

Before international rollout, review:

* warning colors
* mourning associations
* celebration colors
* payment states
* trust signals
* promotional symbolism

Semantic colors should remain familiar and understandable.

---

## 42. Color Tokens

Use semantic tokens instead of raw hex values.

Bad:

```tsx
<div className="bg-[#f4eee9] text-[#2b2623]">
```

Preferred:

```tsx
<div className="bg-surface-subtle text-primary">
```

Raw palette tokens describe what a color is.

Semantic tokens describe what a color does.

---

## 43. Token Architecture

Recommended structure:

```text
Primitive tokens
↓
Semantic tokens
↓
Component tokens
↓
Campaign tokens
```

### Primitive Tokens

```text
neutral-100
rose-500
berry-700
```

### Semantic Tokens

```text
surface-base
text-primary
border-default
action-primary
```

### Component Tokens

```text
button-primary-bg
input-border-focus
badge-sale-bg
```

### Campaign Tokens

```text
holiday-primary
summer-soft
launch-accent
```

---

## 44. Example CSS Token System

```css
:root {
  --color-white: #ffffff;
  --color-black: #151311;

  --color-neutral-50: #faf9f7;
  --color-neutral-100: #f5f3ef;
  --color-neutral-200: #e9e5df;
  --color-neutral-300: #d7d1c9;
  --color-neutral-500: #7d766e;
  --color-neutral-700: #45403b;
  --color-neutral-900: #211e1c;

  --color-brand-100: #f5e9ec;
  --color-brand-500: #a76475;
  --color-brand-700: #74404f;
  --color-brand-900: #43252d;

  --surface-base: var(--color-white);
  --surface-subtle: var(--color-neutral-50);
  --surface-muted: var(--color-neutral-100);
  --surface-inverse: var(--color-neutral-900);

  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-700);
  --text-tertiary: var(--color-neutral-500);
  --text-inverse: var(--color-white);

  --border-subtle: var(--color-neutral-100);
  --border-default: var(--color-neutral-200);
  --border-strong: var(--color-neutral-300);

  --action-primary-bg: var(--color-neutral-900);
  --action-primary-text: var(--color-white);
  --action-primary-hover: var(--color-neutral-700);

  --focus-ring: var(--color-brand-500);
}
```

---

## 45. Tailwind Color Tokens

Example Tailwind configuration:

```ts
export default {
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--surface-base)",
          subtle: "var(--surface-subtle)",
          muted: "var(--surface-muted)",
          inverse: "var(--surface-inverse)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        action: {
          primary: "var(--action-primary-bg)",
          "primary-hover": "var(--action-primary-hover)",
        },
      },
    },
  },
};
```

---

## 46. Design Token JSON

Example:

```json
{
  "color": {
    "surface": {
      "base": {
        "value": "{color.neutral.0}"
      },
      "subtle": {
        "value": "{color.neutral.50}"
      },
      "inverse": {
        "value": "{color.neutral.900}"
      }
    },
    "text": {
      "primary": {
        "value": "{color.neutral.900}"
      },
      "secondary": {
        "value": "{color.neutral.600}"
      },
      "inverse": {
        "value": "{color.neutral.0}"
      }
    }
  }
}
```

The token naming system must remain platform-independent.

---

## 47. Component Color Tokens

Components may define local semantic tokens.

Example button tokens:

```css
:root {
  --button-primary-bg: var(--action-primary-bg);
  --button-primary-text: var(--text-inverse);
  --button-primary-border: transparent;
  --button-primary-hover-bg: var(--action-primary-hover);
}
```

Example input tokens:

```css
:root {
  --input-bg: var(--surface-base);
  --input-text: var(--text-primary);
  --input-border: var(--border-default);
  --input-border-hover: var(--border-strong);
  --input-border-focus: var(--focus-ring);
  --input-error: var(--error-default);
}
```

---

## 48. Color Naming Rules

Names must describe role, not appearance.

Avoid:

```text
light-gray
dark-pink
pretty-beige
button-black
```

Prefer:

```text
surface-muted
text-primary
brand-soft
action-primary
border-subtle
```

Appearance may change between themes.

Role should remain stable.

---

## 49. Color Governance

No new color may be added without answering:

1. What role does it serve?
2. Is an existing token insufficient?
3. Does it work in light and dark themes?
4. Does it pass contrast requirements?
5. Is it reusable?
6. Is it brand-consistent?
7. Is it semantic or decorative?
8. Who owns its maintenance?

Random color additions create long-term inconsistency.

---

## 50. Color Audit Rules

Audit the interface for:

* raw hex values
* duplicate colors
* nearly identical grays
* inaccessible text
* inconsistent button states
* excessive accent usage
* missing dark theme mappings
* semantic colors used decoratively
* inconsistent promotional treatment
* unreadable image overlays

---

## 51. Color Distribution

Recommended visual distribution for premium commerce:

```text
70–85% neutrals
10–20% product imagery and editorial color
5–10% brand and interaction accents
```

This is a directional rule, not a mathematical requirement.

The interface should feel visually calm.

---

## 52. Do Examples

### Do

* Use neutrals as the foundation.
* Give each color a defined role.
* Use accent colors sparingly.
* Preserve product image prominence.
* Meet contrast requirements.
* Use semantic tokens.
* Test text over real photography.
* Define all interaction states.
* Support accessible swatches.
* Maintain brand consistency.
* Use warm neutrals intentionally.
* Audit promotional colors.

---

## 53. Don’t Examples

### Don’t

* Use random hex values.
* Add colors for decoration.
* Make every section a different color.
* Use red for every price.
* Depend on color alone for state.
* Use low-contrast gray text.
* Apply pure black everywhere.
* Copy generic luxury gold palettes.
* Mix warm and cool neutrals randomly.
* Create dark mode by inversion.
* Use semantic colors decoratively.
* Allow campaigns to replace core colors.
* use too many accent colors.

---

## 54. Color Acceptance Criteria

A page is approved only if:

* all colors come from approved tokens
* visual hierarchy is clear
* product imagery remains dominant
* primary text is readable
* secondary text meets contrast requirements
* primary actions are obvious
* selected states are clear
* focus states are visible
* errors do not rely on color alone
* price hierarchy is understandable
* promotional color is restrained
* image overlays are tested
* swatches are accessible
* dark surfaces remain readable
* no random hex values exist
* brand color usage feels intentional

---

## 55. AI Implementation Rules

When an AI agent creates or modifies a page, it must:

1. Use semantic color tokens.
2. Never introduce raw hex values inside components.
3. Preserve product image prominence.
4. Check all text contrast.
5. Define hover, active, focus, selected, and disabled states.
6. Avoid using brand color as the default for every action.
7. Use semantic colors only for system meaning.
8. Validate text over images.
9. Ensure state is not communicated by color alone.
10. Run the color review checklist.

---

## 56. Self-Review Checklist

Before finalizing color usage, verify:

```text
[ ] Are all colors defined in tokens?

[ ] Is the neutral temperature consistent?

[ ] Does the interface feel calm?

[ ] Are product images visually dominant?

[ ] Is brand color used selectively?

[ ] Does primary text have sufficient contrast?

[ ] Does secondary text remain readable?

[ ] Are borders visible but subtle?

[ ] Are buttons clearly prioritized?

[ ] Are hover and active states defined?

[ ] Are focus rings visible?

[ ] Are selected states understandable?

[ ] Are disabled states still readable?

[ ] Do semantic colors communicate real states?

[ ] Is color never the only signal?

[ ] Are price colors restrained?

[ ] Are promotional colors brand-consistent?

[ ] Are color swatches accessible?

[ ] Is text over imagery tested?

[ ] Are dark sections properly mapped?

[ ] Is dark mode intentionally designed?

[ ] Are there any raw hex values in components?

[ ] Are duplicate colors removed?

[ ] Does the page feel premium and coherent?
```

---

## 57. Final Principle

A premium color system should feel almost invisible.

The user should notice:

* the products
* the photography
* the hierarchy
* the confidence
* the clarity

They should not notice a collection of competing colors.

When uncertain:

```text
Return to neutral.

Reduce saturation.

Strengthen contrast.

Use accent with intention.

Protect the product.
```
