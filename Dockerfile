FROM node:22-alpine AS base
WORKDIR /app

# Pin pnpm to v9 to match lockfile format
RUN npm install -g pnpm@9

# Copy workspace config & npmrc BEFORE install so catalog/peer settings apply
COPY .npmrc package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY scripts/ ./scripts/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/db run build 2>/dev/null || true
RUN pnpm --filter @workspace/api-zod run build 2>/dev/null || true
RUN pnpm --filter @workspace/api-server run build

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
