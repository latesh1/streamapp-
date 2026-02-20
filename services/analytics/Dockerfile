FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/analytics/package.json ./services/analytics/
COPY tsconfig.base.json ./

RUN npm ci

COPY services/analytics ./services/analytics

WORKDIR /app/services/analytics
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/services/analytics/package.json ./services/analytics/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/analytics/dist ./services/analytics/dist

WORKDIR /app/services/analytics

EXPOSE 7000

CMD ["npm", "start"]
