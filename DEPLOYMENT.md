# Production Deployment (PM2 + Docker)

This guide replaces the Kubernetes instructions. We will use **Docker for Infrastructure** and **PM2 for Microservices**.

## 1. Infrastructure (Docker)
Start the database, redis, and webRTC server using Docker.
```bash
docker-compose up -d mongo redis minio livekit
```

## 2. Microservices (PM2)
Ensure you have built all services first.

### Build
```bash
npm run build --workspaces
```

### Install PM2
```bash
npm install -g pm2
```

### Start Services
```bash
pm2 start ecosystem.config.js
```

### Monitor
```bash
pm2 monit
```

### Logs
```bash
pm2 logs
```

## 3. NGINX Gateway
For the API Gateway, you should install NGINX on the host machine and point it to the PM2 ports.

Example NGINX config (Host):
```nginx
server {
    listen 80;
    server_name stream.yourdomain.com;

    location /api/auth { proxy_pass http://localhost:4000; }
    location /api/stream { proxy_pass http://localhost:5000; }
    location /api/chat { proxy_pass http://localhost:6000; }
    location /api/analytics { proxy_pass http://localhost:7000; }
    location / { proxy_pass http://localhost:3000; }
}
```
