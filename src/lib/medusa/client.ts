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

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000';
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
  return (await response.json()) as T;
}
