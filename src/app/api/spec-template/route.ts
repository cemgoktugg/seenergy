import { NextResponse, type NextRequest } from 'next/server';

import { categoryKeyFromHandle } from '@/data/catalog';
import { categorySpec } from '@/data/specs';

/**
 * GET /api/spec-template?category=<Medusa category handle>
 *
 * The category's specification template, for the admin's product form
 * ("Kategori şablonunu yükle"): the shop starts from the typical rows and
 * corrects them for the product instead of typing a sheet from nothing.
 *
 * The templates live here, in src/data/specs.ts, and the admin is served by
 * Medusa on another origin — so this answers that one origin's CORS request.
 * No secret: it returns the same rows every product page already shows.
 */

function allowedOrigin(): string {
  try {
    return new URL(process.env.MEDUSA_BACKEND_URL ?? '').origin;
  } catch {
    return 'http://localhost:9000';
  }
}

export function GET(request: NextRequest) {
  const key = categoryKeyFromHandle(request.nextUrl.searchParams.get('category') ?? '');
  const spec = key ? categorySpec(key) : undefined;
  return NextResponse.json(
    { groups: spec?.groups ?? [] },
    { headers: { 'Access-Control-Allow-Origin': allowedOrigin(), Vary: 'Origin' } },
  );
}
