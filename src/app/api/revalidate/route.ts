import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * POST /api/revalidate — called by the Medusa backend after an admin save.
 *
 * The catalogue and the vitrin are cached for 60 seconds; this drops the named
 * cache tags at once, so a price or a "Haftanın Ürünleri" change is live on
 * the next page view. Guarded by a shared secret: without it anyone could
 * flush the cache on demand.
 */

const ALLOWED = new Set(['catalog', 'vitrin']);

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = (Array.isArray(body.tags) ? body.tags : []).filter(
    (tag): tag is string => typeof tag === 'string' && ALLOWED.has(tag),
  );
  for (const tag of tags) revalidateTag(tag);
  return NextResponse.json({ ok: true, revalidated: tags });
}
