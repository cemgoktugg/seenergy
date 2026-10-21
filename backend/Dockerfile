# SEENERGY — Medusa backend and admin.
#
# Build context: backend/   (Dokploy: Build Type "Dockerfile",
#   Docker File "Dockerfile", Docker Context Path "backend")
#
# Runs Medusa from its build output (.medusa/server), as Medusa v2 expects in
# production. The dependencies are the ones the lockfile installed in the
# build stage, pruned to production — not a fresh `npm install` against the
# registry, so the image runs exactly the versions development ran.
#
# Uploaded pictures live in /server/static. Mount a persistent volume THERE,
# or every redeploy loses what was uploaded in the admin since the last build.
# The pictures already in the repo are copied in as the starting content.

FROM node:22-bookworm-slim AS build
WORKDIR /repo
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm ci
COPY apps/backend apps/backend
RUN cd apps/backend && npx medusa build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /server
ENV NODE_ENV=production
COPY --from=build /repo/apps/backend/.medusa/server ./
COPY --from=build /repo/node_modules ./node_modules
COPY apps/backend/static ./static
COPY docker-start.sh ./docker-start.sh
EXPOSE 9000
# Migrations, the admin login when ADMIN_EMAIL/ADMIN_PASSWORD are set, then
# the server.
CMD ["sh", "/server/docker-start.sh"]
