# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY ./src ./src

# ---------- Stage 2: Final Image ----------
FROM node:20-alpine

WORKDIR /app

# copy only necessary files
COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]
