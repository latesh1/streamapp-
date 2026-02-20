"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 6000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    console.log('Redis Adapter connected');
});
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });
    socket.on('send_message', (data) => {
        const { roomId, message, username } = data;
        io.to(roomId).emit('receive_message', {
            user: username,
            message,
            timestamp: new Date().toISOString(),
        });
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`Chat Service running on port ${PORT}`);
});
