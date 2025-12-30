# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY ./src ./src

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "src/index.js"]
