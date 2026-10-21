#!/bin/sh
# Container start for the storefront (see Dockerfile).
#
# Starts Next, then — once it answers — drops the catalogue and vitrin caches
# a single time. Pages prerendered while the backend was unreachable (a first
# deploy builds this image before the backend exists) otherwise keep serving
# their empty build-time version: measured on the live server, time-based
# revalidation never replaced it; a tag revalidation did, at once.

npm run start &
NEXT_PID=$!
trap 'kill -TERM "$NEXT_PID" 2>/dev/null' TERM INT

if [ -n "$REVALIDATE_SECRET" ]; then
  node -e "
    (async () => {
      for (let i = 0; i < 60; i++) {
        try {
          const r = await fetch('http://localhost:3100/api/revalidate', {
            method: 'POST',
            headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET, 'content-type': 'application/json' },
            body: JSON.stringify({ tags: ['catalog', 'vitrin'] }),
          });
          if (r.ok) { console.log('[seenergy] caches refreshed after start'); return; }
        } catch {}
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      console.log('[seenergy] could not refresh the caches after start');
    })();
  " &
fi

wait "$NEXT_PID"
