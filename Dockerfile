# syntax=docker/dockerfile:1.7

FROM node:24.17.0-bookworm-slim AS build
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @zytgen/api... build

FROM node:24.17.0-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
WORKDIR /app

RUN groupadd --system --gid 10001 zytgen && useradd --system --uid 10001 --gid 10001 --create-home zytgen

COPY --from=build --chown=zytgen:zytgen /app/node_modules ./node_modules
COPY --from=build --chown=zytgen:zytgen /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=zytgen:zytgen /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=zytgen:zytgen /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=zytgen:zytgen /app/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=build --chown=zytgen:zytgen /app/packages/contracts/dist ./packages/contracts/dist

USER 10001:10001
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/start.js"]
