import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Schema, Document } from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// Analytics Model
interface IEvent extends Document {
    streamId: string;
    eventType: 'view' | 'heartbeat' | 'error';
    timestamp: Date;
    meta?: any;
}

const EventSchema = new Schema({
    streamId: { type: String, required: true },
    eventType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    meta: { type: Object },
});

const Event = mongoose.model<IEvent>('Event', EventSchema);

// Routes
app.post('/api/analytics/track', async (req, res) => {
    try {
        const { streamId, eventType, meta } = req.body;
        const event = new Event({ streamId, eventType, meta });
        await event.save();
        res.status(200).send('ok');
    } catch (err) {
        console.error('Error saving analytics', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/analytics/stream/:streamId', async (req, res) => {
    try {
        const { streamId } = req.params;
        const views = await Event.countDocuments({ streamId, eventType: 'view' });
        res.json({ streamId, totalViews: views });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/streamapp-analytics';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Analytics Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
