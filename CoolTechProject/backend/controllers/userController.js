const mongoose = require('mongoose');
const User = require('../models/User');
const Division = require('../models/Division');
const jwt = require('jsonwebtoken');

// Assign a user to a division
exports.assignUser = async (req, res) => {
    try {
        const { userId, divisionId } = req.body;

        console.log('Assign User - userId:', userId, 'divisionId:', divisionId);

        // Validate user ID and division ID
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(divisionId)) {
            return res.status(400).send({ error: 'Invalid user ID or division ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).send({ error: 'Division not found' });
        }

        // Assign user to division
        if (!division.users.includes(userId)) {
            division.users.push(userId);
        }
        if (!user.divisions.includes(divisionId)) {
            user.divisions.push(divisionId);
        }

        await division.save();
        await user.save();

        // Update token with new division access
        const token = jwt.sign(
            { id: user._id, role: user.role, divisions: user.divisions, organizationalUnits: user.organizationalUnits },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).send({ message: 'User assigned to division successfully', user, token });
    } catch (error) {
        console.error('Error assigning user:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
};

// Change a user's role
exports.changeUserRole = async (req, res) => {
    try {
        const { id } = req.params; // Extract the user ID from the route parameters
        const { newRole } = req.body; // Extract the new role from the request body

        console.log('Change User Role - id:', id, 'newRole:', newRole);

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        const user = await User.findById(id); // Find the user by ID
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.role = newRole; // Update the user's role
        await user.save();

        res.status(200).send({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error changing user role:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
};

// Get user details by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the user ID from the route parameters

        console.log('Get User by ID - id:', id);

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        const user = await User.findById(id).populate('divisions'); // Find the user and populate their divisions
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ user });
    } catch (error) {
        console.error('Error fetching user details by ID:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        console.log('Get All Users');

        const users = await User.find().select('-password'); // Exclude passwords
        console.log('Users fetched:', users);
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user details for the logged-in user
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the request object

        console.log('Get User Details - userId:', userId);

        const user = await User.findById(userId).populate('divisions'); // Find the user and populate their divisions
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
};
