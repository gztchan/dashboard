FROM node:22-alpine

WORKDIR /app

RUN corepack use pnpm@10.32.1

RUN corepack enable

COPY . .

ENV NODE_ENV=production

RUN CI=true pnpm install --no-lockfile --no-cache

WORKDIR /app/app

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]