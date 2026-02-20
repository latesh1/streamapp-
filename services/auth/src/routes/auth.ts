import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const streamKey = role === 'creator' ? uuidv4() : undefined;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer',
            streamKey,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role, streamKey: user.streamKey } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

export default router;
