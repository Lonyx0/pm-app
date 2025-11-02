const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const exists = await User.findOne( { $or: [ { email }, { username } ] } );
        if(exists) return res.status(400).json({ message: 'User already exists' });
        
        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        const user = await User.findOne( { $or: [ { email: emailOrUsername }, { username: emailOrUsername } ] } );
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await user.matchPassword(password);
        if(!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;