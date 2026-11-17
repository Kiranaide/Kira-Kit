# syntax=docker/dockerfile:1

# ---- Build stage: registry + docs + Vite bundle, all with Bun ----
FROM oven/bun:1 AS build
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
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
