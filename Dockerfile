# syntax=docker/dockerfile:1

# ---- Build stage: registry + docs + Vite bundle, all with Bun ----
FROM oven/bun:1.4.4 AS build
WORKDIR /app

# Root dependencies (showcase site + toolchain)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# CLI dependencies (own node_modules; shadcn is pinned here)
COPY packages/cli/package.json packages/cli/bun.lock packages/cli/
RUN cd packages/cli && bun install --frozen-lockfile

# Sources
COPY . .

# 1-6: checks gate → theme presets → validate → build public/r → prune → docs
RUN bun packages/cli/src/index.ts build

# Static site build; vite copies public/ (registry + docs) into dist/
RUN bunx vite build

# ---- Serve stage: nginx with SPA fallback and cache/CORS policy ----
FROM nginx:1-alpine
# Container listen port; override in Coolify (or `docker run -e PORT=...`).
# The stock nginx entrypoint envsubst-renders the template into conf.d/.
ENV PORT=80
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
