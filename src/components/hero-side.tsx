/**
 * The tower beside the hero.
 *
 * WHY IT EXISTS
 *
 * The top of the page was one 1320×423 slide: a single entry point, which
 * reads as an advertisement rather than a shop. Two stacked tiles beside it
 * turn the first screen into three destinations without making it taller — the
 * band keeps its measured 423px, the slide simply stops owning all of it.
 *
 * LAYOUT
 *
 * From `dt` the two tiles stack vertically and fill the row's height, so the
 * hero's 423px is shared rather than extended. Below `dt` they sit side by side
 * under the hero as a short pair — NOT hidden. Hiding them would take two real
 * destinations away from the viewport where navigation is hardest, which is the
 * opposite of the point.
 *
 * A server component. Each tile is a campaign card (campaign-card.tsx).
 */

import { CampaignCard } from '@/components/campaign-card';
import type { Banner } from '@/lib/medusa/vitrin';

/** Tiles come from the Vitrin module (admin → Vitrin → Slayt yanı kartlar). */
export function HeroSide({ items }: { items: Banner[] }) {
  return (
    <div className="grid grid-cols-2 gap-(--space-grid-gap) dt:h-full dt:grid-cols-1 dt:grid-rows-2">
      {items.map((item, i) => (
        <CampaignCard key={`${i}-${item.href}`} size="tile" eager {...item} />
      ))}
    </div>
  );
}
