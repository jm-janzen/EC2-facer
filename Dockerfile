FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3333

CMD ["node", "facer.js", "3333", "true"]
