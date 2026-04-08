FROM node:24-alpine

WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN corepack pnpm install --frozen-lockfile

COPY . .

RUN corepack pnpm build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "dist/index.js"]

