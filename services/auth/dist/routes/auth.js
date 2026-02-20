"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const streamKey = role === 'creator' ? (0, uuid_1.v4)() : undefined;
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer',
            streamKey,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password || '');
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, streamKey: user.streamKey } });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.default = router;
