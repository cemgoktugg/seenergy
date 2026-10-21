# SEENERGY — storefront (Next.js).
#
# Build context: the repository root  (Dokploy: Build Type "Dockerfile",
#   Docker File "Dockerfile", Docker Context Path ".")
#
# Pass the backend's public address and the publishable key as build
# arguments, and set the same two (plus REVALIDATE_SECRET) at runtime.
#
# Pages are prerendered from the Medusa catalogue when the backend answers
# during the build. When it does not — a first `docker compose up` builds
# this image before the backend container exists — the build still succeeds
# (SEENERGY_IMAGE_BUILD, see src/lib/medusa/catalog.ts) and the pages fill in
# within a minute of the backend coming up.

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG MEDUSA_BACKEND_URL
ARG MEDUSA_PUBLISHABLE_KEY
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL \
    MEDUSA_PUBLISHABLE_KEY=$MEDUSA_PUBLISHABLE_KEY \
    NEXT_TELEMETRY_DISABLED=1
RUN SEENERGY_IMAGE_BUILD=1 npm run build

# The dependencies are NOT pruned to production: `next start` loads
# next.config.ts, and without TypeScript in node_modules Next tries to install
# it at runtime — which, measured in the first build of this image, re-resolved
# the dependency tree without the lockfile and left Next's own modules
# mismatched (every route a 500).
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./
EXPOSE 3100
CMD ["npm", "run", "start"]
