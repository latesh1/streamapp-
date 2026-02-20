FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/stream/package.json ./services/stream/
COPY tsconfig.base.json ./

RUN npm ci

COPY services/stream ./services/stream

WORKDIR /app/services/stream
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/services/stream/package.json ./services/stream/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/stream/dist ./services/stream/dist

WORKDIR /app/services/stream

EXPOSE 5000

CMD ["npm", "start"]
