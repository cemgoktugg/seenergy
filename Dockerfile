# SEENERGY — storefront (Next.js).
#
# Build context: the repository root  (Dokploy: Build Type "Dockerfile",
#   Docker File "Dockerfile", Docker Context Path ".")
#
# The backend must be RUNNING and reachable while this builds: product,
# category and brand pages are prerendered from the Medusa catalogue. Pass its
# public address and the publishable key as build arguments, and set the same
# two (plus REVALIDATE_SECRET) as runtime environment variables.

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
RUN npm run build

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
