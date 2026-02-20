FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/chat/package.json ./services/chat/
COPY tsconfig.base.json ./

RUN npm ci

COPY services/chat ./services/chat

WORKDIR /app/services/chat
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/services/chat/package.json ./services/chat/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/chat/dist ./services/chat/dist

WORKDIR /app/services/chat

EXPOSE 6000

CMD ["npm", "start"]
