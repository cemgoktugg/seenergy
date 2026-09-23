'use client';

/**
 * Favourites and compare — one client store behind both.
 *
 * Both are a set of product ids the visitor builds up, which must survive
 * navigation and a reload. The cart used to live here too; it is Medusa's now
 * (see cart-provider.tsx), because a cart has to become an order.
 *
 * Persistence is `localStorage`, deliberately: these lists are per-browser
 * conveniences, not commerce data, and nothing about them is sent anywhere.
 *
 * WHY `useSyncExternalStore` AND NOT AN EFFECT
 *
 * `localStorage` is external state. Copying it into React state from an effect
 * means calling setState during an effect, which cascades renders and is what
 * `react-hooks/set-state-in-effect` exists to stop. Subscribing to it instead
 * also fixes hydration for free: the server snapshot is empty, the client
 * snapshot is the stored value, and React swaps them without a mismatch.
 *
 * The one trap: `getSnapshot` must return a REFERENTIALLY STABLE value. Parsing
 * the JSON on every call would hand React a fresh object each time and spin it
 * into an infinite render loop, so the parsed state is cached against the raw
 * string and only re-parsed when that string actually changes.
 *
 * Every storage access is wrapped, because it throws in private windows and
 * when a browser is set to block site data — the page must render normally
 * when it does.
 */

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

const KEY = 'seenergy.store.v1';

export type Bucket = 'favourites' | 'compare';

/** Compare is capped: a comparison table stops being readable past four. */
export const COMPARE_LIMIT = 4;

type State = Record<Bucket, string[]>;

const EMPTY: State = { favourites: [], compare: [] };

/* ------------------------------------------------------------------ */
/* The store itself — a module singleton, not per-component state       */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

/** `null` means "cache is stale, re-read". */
let cachedRaw: string | null | undefined;
let cachedState: State = EMPTY;

const asIds = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

function parse(raw: string | null): State {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      favourites: asIds(parsed.favourites),
      compare: asIds(parsed.compare),
    };
  } catch {
    // Corrupt storage is not worth failing a page render over.
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): State {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parse(raw);
  }
  return cachedState;
}

/** Stable across calls, so the server render and hydration agree. */
function getServerSnapshot(): State {
  return EMPTY;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  // Another tab writing the same key must not leave this one stale.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    cachedRaw = undefined;
    onStoreChange();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

function persist(next: State) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private window, blocked site data, quota — the page still works */
  }
  // Invalidate before notifying, so every listener re-reads the new value.
  cachedRaw = undefined;
  for (const listener of listeners) listener();
}

const getMounted = () => true;
const getNotMounted = () => false;

/* ------------------------------------------------------------------ */
/* React surface                                                       */
/* ------------------------------------------------------------------ */

interface StoreValue {
  state: State;
  /** False during the server render and hydration, true once mounted. */
  ready: boolean;
  has: (bucket: Bucket, id: string) => boolean;
  toggle: (bucket: Bucket, id: string) => void;
  add: (bucket: Bucket, id: string) => void;
  remove: (bucket: Bucket, id: string) => void;
  clear: (bucket: Bucket) => void;
  count: (bucket: Bucket) => number;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribe, getMounted, getNotMounted);

  const value = useMemo<StoreValue>(() => {
    const has = (bucket: Bucket, id: string) => state[bucket].includes(id);

    const add = (bucket: Bucket, id: string) => {
      if (state[bucket].includes(id)) return;
      if (bucket === 'compare' && state.compare.length >= COMPARE_LIMIT) return;
      persist({ ...state, [bucket]: [...state[bucket], id] });
    };

    const remove = (bucket: Bucket, id: string) =>
      persist({ ...state, [bucket]: state[bucket].filter((item) => item !== id) });

    return {
      state,
      ready,
      has,
      add,
      remove,
      toggle: (bucket, id) => (has(bucket, id) ? remove(bucket, id) : add(bucket, id)),
      clear: (bucket) => persist({ ...state, [bucket]: [] }),
      count: (bucket) => state[bucket].length,
    };
  }, [state, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside <StoreProvider>');
  }
  return context;
}
