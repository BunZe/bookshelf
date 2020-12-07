# --- Base ---
FROM node:15.3.0-alpine AS base

WORKDIR /usr/src/bookshelf
COPY package*.json ./

# --- Deps ---
FROM base AS deps
RUN npm ci

# --- Build ---
FROM deps AS build
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server/server.js"]








