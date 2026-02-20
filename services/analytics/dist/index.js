"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_2 = require("mongoose");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const EventSchema = new mongoose_2.Schema({
    streamId: { type: String, required: true },
    eventType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    meta: { type: Object },
});
const Event = mongoose_1.default.model('Event', EventSchema);
// Routes
app.post('/api/analytics/track', async (req, res) => {
    try {
        const { streamId, eventType, meta } = req.body;
        const event = new Event({ streamId, eventType, meta });
        await event.save();
        res.status(200).send('ok');
    }
    catch (err) {
        console.error('Error saving analytics', err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/analytics/stream/:streamId', async (req, res) => {
    try {
        const { streamId } = req.params;
        const views = await Event.countDocuments({ streamId, eventType: 'view' });
        res.json({ streamId, totalViews: views });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/streamapp-analytics';
mongoose_1.default
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
