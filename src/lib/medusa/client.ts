/**
 * Medusa Store API client.
 *
 * A thin `fetch` wrapper rather than `@medusajs/js-sdk`: the Store API is plain
 * REST, and docs/PROJECT_BRIEF_ELECTRONICS §2 caps the storefront's runtime
 * dependencies at next, react, react-dom and lucide-react. Every call runs on
 * the server — the backend URL and the publishable key never reach the browser.
 * Neither variable is `NEXT_PUBLIC_`, so Next cannot inline them into a client
 * bundle even if this module were imported from one by mistake.
 */

/* Where the API calls go. On the server the storefront and the backend share
   the compose's internal network, so MEDUSA_INTERNAL_URL (http://backend:9000)
   is used and the calls never leave the machine — no public DNS, TLS or Traefik
   round trip. MEDUSA_BACKEND_URL stays the PUBLIC address: it is what image
   URLs carry and what next.config allows for next/image. */
const BACKEND_URL = process.env.MEDUSA_INTERNAL_URL || process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? '';

export class MedusaError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type Init = Omit<RequestInit, 'body'> & {
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** Customer JWT, for /store/customers/* and order history. */
  token?: string;
};

export async function medusa<T>(path: string, { body, query, token, headers, ...init }: Init = {}) {
  if (!PUBLISHABLE_KEY) {
    throw new Error('MEDUSA_PUBLISHABLE_KEY is not set — see .env.example.');
  }

  const url = new URL(path, BACKEND_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        'content-type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    // The one failure worth a precise message: the backend simply isn't up.
    throw new Error(
      `Medusa backend at ${BACKEND_URL} is not answering. Start it with \`npm run backend:dev\`.`,
      { cause },
    );
  }

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new MedusaError(detail?.message ?? `${path} → ${response.status}`, response.status);
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    // Named, not a bare "Unexpected end of JSON input": say which call got
    // what, so a truncated body is traceable to its request.
    throw new Error(
      `Medusa ${init.method ?? 'GET'} ${url.pathname} returned unparseable JSON: ` +
        `${text.length} chars, content-length ${response.headers.get('content-length') ?? 'n/a'}, ` +
        `x-nextjs-cache ${response.headers.get('x-nextjs-cache') ?? 'n/a'}`,
    );
  }
}
