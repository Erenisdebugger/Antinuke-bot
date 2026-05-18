FROM node:22-alpine
WORKDIR /app

# Corepack + pnpm
RUN corepack enable pnpm

# Config files first
COPY .npmrc package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./

# Copy built artifacts
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY scripts/ ./scripts/

# Install & Build
RUN pnpm install --ignore-scripts --frozen-lockfile

# esbuild fix
RUN cd node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild && node install.js || true

# Build workspaces
RUN pnpm --filter @workspace/db run build 2>/dev/null || true
RUN pnpm --filter @workspace/api-zod run build 2>/dev/null || true
RUN pnpm --filter @workspace/api-server run build

EXPOSE 8080

# Keep source maps off for stability
CMD ["node", "./artifacts/api-server/dist/index.mjs"]