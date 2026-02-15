const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h', algorithm: 'HS256' }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = {};

        if (!name || typeof name !== 'string' || name.trim() === '') {
            errors.name = 'Name is required and must be a string';
        }
        if (!email || typeof email !== 'string' || email.trim() === '') {
            errors.email = 'Email is required and must be a string';
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            success: true,
            message: 'Registration successful. Please login now.',
            data: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = signToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = {
    register,
    login
};