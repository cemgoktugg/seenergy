'use client';

/**
 * Theme control — three states, not two.
 *
 *   system  follow the OS (no data-theme attribute; the media query decides)
 *   light   explicit
 *   dark    explicit
 *
 * "System" is a real state rather than a hidden default. Without it, a visitor
 * whose OS switches to dark at sunset would be stuck on whatever they last
 * clicked, and there would be no way back to "just do what my machine does".
 * So the control cycles system → light → dark → system, and only the two
 * explicit states are written to storage; choosing system REMOVES the key and
 * the attribute, which is exactly the state a first-time visitor is in.
 *
 * THE COLOURS ARE NOT SET HERE.
 *
 * globals.css owns every value. This component only stamps `data-theme` on the
 * root element, and the pre-paint script in layout.tsx does the same thing
 * earlier for a returning visitor. Nothing about the palette can drift between
 * the two, because neither of them knows a single colour.
 *
 * HYDRATION
 *
 * The server cannot know what is in localStorage, so the first render must not
 * depend on it. `useSyncExternalStore` supplies a `false` server snapshot and
 * the real value after mount — the same idiom the cart store uses — and until
 * then the button renders its neutral system state. The PAGE is already in the
 * right theme by that point regardless: the pre-paint script handled it.
 */

import { useCallback, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'seenergy-theme';

type Theme = 'system' | 'light' | 'dark';

const ORDER: Theme[] = ['system', 'light', 'dark'];

const LABELS: Record<Theme, string> = {
  system: 'Sistem teması',
  light: 'Açık tema',
  dark: 'Koyu tema',
};

const ICONS = { system: Monitor, light: Sun, dark: Moon };

/* A module-level subscriber list, because two copies of this control (the full
   header and the condensed bar) must agree instantly rather than one of them
   waiting for a re-render that never comes. */
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  /* Another tab changing the preference is a real event, not a curiosity: the
     same person, the same choice. */
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function read(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    /* Storage throws outright in some privacy modes. */
    return 'system';
  }
}

/** The server renders the neutral state; nothing else is knowable there. */
const serverSnapshot = (): Theme => 'system';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, serverSnapshot);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(read()) + 1) % ORDER.length];
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Not worth failing the interaction over — the attribute below still
         applies for this page view. */
    }
    if (next === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    emit();
  }, []);

  const Icon = ICONS[theme];
  const nextLabel = LABELS[ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]];

  return (
    <button
      type="button"
      onClick={cycle}
      /* The accessible name carries BOTH the current state and what a press
         will do. An icon-only control that only announces "tema" leaves a
         screen-reader user pressing it to find out. */
      aria-label={`${LABELS[theme]} etkin. ${nextLabel} için tıklayın.`}
      title={LABELS[theme]}
      /* Base is geometry only. Colour comes from the caller, because this
         control appears both on the white header row and on chrome, and those
         want opposite inks. */
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-(--duration-fast) ease-in-out ${className}`}
    >
      <Icon size={16} strokeWidth={1.9} aria-hidden />
    </button>
  );
}
