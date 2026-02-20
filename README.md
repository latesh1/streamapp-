# Scalable Live Streaming Platform

## Architecture

This project uses a microservices architecture within a monorepo.

### Services
- **Auth Service (`services/auth`)**: Handles user registration and JWT authentication.
- **Stream Service (`services/stream`)**: Manages LiveKit tokens and webhooks.
- **Chat Service (`services/chat`)**: Real-time chat using Socket.io and Redis.
- **Analytics Service (`services/analytics`)**: Tracks stream metrics.

### Frontend
- **Web App (`apps/web`)**: Next.js 13+ application for streaming and viewing.
- **Mobile App (`apps/mobile`)**: Flutter application (placeholder).

### Infrastructure (`docker-compose.yml`)
- **MongoDB**: Database for Auth and Analytics.
- **Redis**: Pub/Sub for Chat and caching.
- **MinIO**: S3-compatible storage for recordings.
- **LiveKit**: WebRTC media server.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- npm (v9+)

### Installation

1. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

2. Start the infrastructure (Database, Redis, LiveKit):
   ```bash
   docker-compose up -d
   ```

3. Start the backend services:
   ```bash
   # Terminal 1
   cd services/auth && npm run dev
   
   # Terminal 2
   cd services/stream && npm run dev
   
   # Terminal 3
   cd services/chat && npm run dev
   
   # Terminal 4
   cd services/analytics && npm run dev
   ```

4. Start the Web App:
   ```bash
   cd apps/web && npm run dev
   ```

5. Access the application at `http://localhost:3000`.

## Configuration
- `livekit.yaml`: Configuration for the local LiveKit server.
- `.env` files should be created in each service directory (examples provided in code).
