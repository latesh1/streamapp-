FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
# Copy service package file
COPY services/auth/package.json ./services/auth/
COPY tsconfig.base.json ./

# Install dependencies (including workspace dependencies)
RUN npm ci

# Copy source code
COPY services/auth ./services/auth

# Build service
WORKDIR /app/services/auth
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/services/auth/package.json ./services/auth/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/auth/dist ./services/auth/dist

WORKDIR /app/services/auth

EXPOSE 4000

CMD ["npm", "start"]
