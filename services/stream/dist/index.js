"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const livekit_server_sdk_1 = require("livekit-server-sdk");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const apiKey = process.env.LIVEKIT_API_KEY || 'API_KEY';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'API_SECRET';
const wsUrl = process.env.LIVEKIT_WS_URL || 'ws://localhost:7880';
const egressClient = new livekit_server_sdk_1.EgressClient(wsUrl, apiKey, apiSecret);
// Generate Token
app.post('/api/stream/token', (req, res) => {
    const { roomName, participantName, identity, isPublisher } = req.body;
    if (!roomName || !identity) {
        return res.status(400).json({ error: 'roomName and identity are required' });
    }
    const at = new livekit_server_sdk_1.AccessToken(apiKey, apiSecret, {
        identity,
        name: participantName || identity,
    });
    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: isPublisher,
        canSubscribe: !isPublisher,
    });
    const token = at.toJwt();
    res.json({ token });
});
// Start HLS Egress
app.post('/api/stream/egress', async (req, res) => {
    const { roomName } = req.body;
    if (!roomName)
        return res.status(400).json({ error: 'roomName is required' });
    try {
        // HLS Output
        const output = {
            protocol: 2, // HLS_PROTOCOL
            filename: `hls/${roomName}/{time}.m3u8`,
            segmentSuffix: `hls/${roomName}/{time}_{index}.ts`,
            s3: {
                accessKey: process.env.S3_ACCESS_KEY,
                secret: process.env.S3_SECRET_KEY,
                region: process.env.S3_REGION,
                bucket: process.env.S3_BUCKET,
                endpoint: process.env.S3_ENDPOINT
            }
        };
        const info = await egressClient.startRoomCompositeEgress(roomName, {
            file: undefined,
            segments: output
        }, {
            layout: 'single-speaker',
        });
        res.json({ egressId: info.egressId });
    }
    catch (error) {
        console.error('Error starting egress', error);
        res.status(500).json({ error: 'Failed to start egress' });
    }
});
// LiveKit Webhook
const receiver = new livekit_server_sdk_1.WebhookReceiver(apiKey, apiSecret);
app.post('/api/stream/webhook', async (req, res) => {
    try {
        const event = await receiver.receive(req.body, req.get('Authorization'));
        console.log('Webhook event:', event.event);
        if (event.event === 'participant_joined') {
            // Logic to start recording/egress automatically if configured
        }
        res.status(200).send('ok');
    }
    catch (error) {
        console.error('Error validating webhook', error);
        res.status(401).send('invalid signature');
    }
});
// Signed URL Helper
const signUrl = (url, secret, expirationSeconds = 3600) => {
    const crypto = require('crypto');
    const expires = Math.floor(Date.now() / 1000) + expirationSeconds;
    const toSign = `${url}?expires=${expires}`;
    const signature = crypto.createHmac('sha256', secret).update(toSign).digest('hex');
    return `${toSign}&signature=${signature}`;
};
// Get Signed Playback URL
app.get('/api/stream/playback/:streamId', (req, res) => {
    const { streamId } = req.params;
    // In production, this URL would point to Cloudflare CDN
    // For local dev, it points to MinIO/S3
    const baseUrl = process.env.CDN_URL || `http://localhost:9000/${process.env.S3_BUCKET || 'stream-bucket'}/hls/${streamId}/index.m3u8`;
    // Simulate signing (Cloudflare uses a specific format, this is generic HMAC)
    const signedUrl = signUrl(baseUrl, process.env.CDN_SIGNING_KEY || 'cdn-secret');
    res.json({ url: signedUrl });
});
app.listen(PORT, () => {
    console.log(`Stream Service running on port ${PORT}`);
});
