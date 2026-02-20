import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Chat Service Running');
});

const server = http.createServer(app);
const PORT = process.env.PORT || 6000;

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
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
