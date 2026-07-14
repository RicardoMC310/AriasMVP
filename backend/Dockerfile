# ---------- Build ----------
FROM node:22-alpine AS builder

RUN corepack enable
RUN corepack prepare pnpm@11.12.0 --activate

WORKDIR /app

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm prune --prod

# ---------- Runtime ----------
FROM node:22-alpine AS runner

RUN corepack enable

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]