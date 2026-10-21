#!/bin/sh
# Container start for the Medusa backend (see backend/Dockerfile).
set -e

# Pending migrations — none on a database restored from deploy/seenergy.sql,
# but a later release may bring some.
npx medusa db:migrate

# The admin login, from ADMIN_EMAIL / ADMIN_PASSWORD when both are set. The
# restored database deliberately carries no users. Once it exists this step
# only reports that; remove ADMIN_PASSWORD from the environment after the
# first deploy so the password does not sit there.
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  if npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" > /tmp/admin-user.log 2>&1; then
    echo "[seenergy] admin user created: $ADMIN_EMAIL"
  else
    echo "[seenergy] admin user not created (it probably exists already) — details in /tmp/admin-user.log"
  fi
fi

exec npx medusa start
