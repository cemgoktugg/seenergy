#!/bin/sh
# Runs ONCE, when the Postgres volume is created empty (the official image
# executes /docker-entrypoint-initdb.d/* only then). Loads the store's data
# and points its stored addresses at the live domains. A redeploy never runs
# it again; to start over, delete the volume.
set -e

echo "[seenergy] restoring /seed/seenergy.sql ..."
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q -f /seed/seenergy.sql

echo "[seenergy] rewriting stored URLs to $SEED_STORE_URL and $SEED_API_URL ..."
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -v store="$SEED_STORE_URL" -v api="$SEED_API_URL" -f /seed/rewrite-urls.sql

echo "[seenergy] database ready."
