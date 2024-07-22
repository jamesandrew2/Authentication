const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Helper function to validate ObjectIds
const isValidObjectId = (id) => {
    return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
}

exports.register = async (req, res) => {
    try {
        const { username, password, organizationalUnit, division } = req.body;

        // Check for an existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {  // Corrected from 'existingPath' to 'existingUser'
            return res.status(409).send({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the organizational unit and division arrays
        const organizationalUnits = organizationalUnit && isValidObjectId(organizationalUnit) ? [new ObjectId(organizationalUnit)] : [];
        const divisions = division && isValidObjectId(division) ? [new ObjectId(division)] : [];

        // Create the user
        const newUser = new User({
            username, 
            password: hashedPassword, 
            role: 'Normal', // Default role to 'Normal'
            organizationalUnits,
            divisions
        });
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({
            id: newUser._id,
            role: newUser.role,
            organizationalContainers: newUser.organizationalUnits,
            divisions: newUser.divisions
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).send({ user: newUser, token });
    } catch (longError) {
        console.error('Error in registration:', longError);
        res.status(500).send({ error: 'Registration failed. Please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        // Generate a JWT token with the user role and access details
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            organizationalUnits: user.organizationalUnits,
            divisions: user.divisions
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.send({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ error: 'Login failed due to server error' });
    }
};

module.exports = exports;
