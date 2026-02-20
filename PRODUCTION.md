# Production Checklist & Scaling Strategy

## 1. Structure & Deployment

### Dockerization
Ensure `Dockerfile` exists for each service (`services/auth`, `services/stream`, `services/chat`, `services/analytics`) and the web app (`apps/web`).

### Kubernetes Manifests
- **Deployments**: Define replicas and resource limits (CPU/Memory).
- **Services**: ClusterIP for internal comms, LoadBalancer (ingress) for external access.
- **Ingress Controller**: NGINX Ingress to route traffic based on path (`/api/auth`, `/api/stream`, `/`).

### Database & Storage
- **Managed Database**: Use AWS RDS (Postgres/MySQL) or MongoDB Atlas. Do not run DB in K8s for prod.
- **Managed Redis**: AWS ElastiCache for Redis.
- **Object Storage**: AWS S3 for HLS segments and recordings. Enable lifecycle policies (delete after 30 days).

## 2. Scaling Strategy

### 1,000 Concurrent Viewers
- Single cluster for services.
- Single LiveKit server instance (large instance).
- Cloudflare CDN for HLS distribution.

### 10,000 Concurrent Viewers
- **Horizontal Pod Autoscaling (HPA)** for `auth` and `chat` services based on CPU > 70%.
- **LiveKit**: Run a cluster of LiveKit servers with Redis for room synchronization.
- **Database**: Add Read Replicas.

### 100,000 Concurrent Viewers
- **Multi-Region Ingest**: Deploy LiveKit nodes in multiple regions (US-East, EU-West, Asia-Pacific) nearest to broadcasters.
- **Origin Shielding**: Use a mid-tier cache between CDN and Origin (S3) to reduce S3 egress costs.
- **Sharding**: Shard the Chat service by `streamId` using consistent hashing.

## 3. Security Checklist
- [ ] **HTTPS Enforced**: Use Cert-Manager in K8s with Let's Encrypt.
- [ ] **WAF**: Enable AWS WAF or Cloudflare WAF.
- [ ] **JWT Verification**: Ensure all private API endpoints verify JWT signature.
- [ ] **Stream Keys**: Validate stream keys strictly on ingest.
- [ ] **Rate Limiting**: Implement rate limiting on Auth and Chat endpoints (Redis-based).
- [ ] **CORS**: Restrict CORS to your domain only.

## 4. Cost Optimization
- **Spot Instances**: Use Spot Instances for the transcoding/worker node groups in K8s.
- **CDN Usage**: Offload 99% of viewer traffic to CDN. Ensure Cache-Control headers are set correctly for HLS segments (long cache) vs playlists (short cache).
- **S3 Tiering**: Move old recordings to S3 Glacier Deep Archive.
