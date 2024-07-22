const mongoose = require('mongoose');
const CredentialRepository = require('../models/CredentialRepository');
const Division = require('../models/Division');
const User = require('../models/User');

/// Add Credential
exports.addCredential = async (req, res) => {
    try {
        const { divisionId } = req.params;
        const { username, password, name: credentialName } = req.body;

        // Validate input
        if (!username || !password || !credentialName) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        // Validate division ID
        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            return res.status(400).send({ error: 'Invalid division ID' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).send({ error: 'Division not found' });
        }

        if (!division.users.includes(req.user._id)) {
            return res.status(403).send({ error: 'Unauthorized to add credentials to this division' });
        }

        // Ensure you are using the correct model constructor
        const newCredential = new CredentialRepository({
            username, 
            password, 
            name: credentialName, 
            division: divisionId
        });
        await newCredential.save();

        // Additional code to add credential ID to the division document
        division.credentials.push(newCredential._id);
        await division.save();

        res.status(201).send({ message: 'Credential added successfully', credential: newCredential });
    } catch (error) {
        console.error('Error adding credential to division:', error);
        res.status(500).send({ error: 'Error adding credential to division' });
    }
};

// List Credentials
exports.listCredentials = async (req, res) => {
    try {
        const { divisionId } = req.params;
        console.log('Received divisionId:', divisionId);

        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            console.log('Invalid division ID:', divisionId);
            return res.status(400).send({ error: 'Invalid division ID' });
        }

        const division = await Division.findById(divisionId).populate('credentials');
        if (!division) {
            console.log('Division not found:', divisionId);
            return res.status(404).send({ error: 'Division not found' });
        }

        if (!division.users.includes(req.user._id)) {
            return res.status(403).send({ error: 'Unauthorized to view credentials of this division' });
        }

        res.status(200).send({ credentials: division.credentials });
    } catch (error) {
        console.error('Error listing credentials:', error);
        res.status(500).send({ error: 'Error listing credentials' });
    }
};

// Get Credential by ID
exports.getCredentialById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Fetching credential by ID:', id); // Log the ID

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid credential ID:', id);
            return res.status(400).send({ error: 'Invalid credential ID' });
        }

        const credential = await CredentialRepository.findById(id);
        if (!credential) {
            console.log('Credential not found:', id); // Log if not found
            return res.status(404).send({ error: 'Credential not found' });
        }

        console.log('Credential found:', credential); // Log the credential
        res.status(200).send(credential);
    } catch (error) {
        console.error('Error fetching credential:', error);
        res.status(500).send({ error: 'Error fetching credential' });
    }
};

// Update Credential
exports.updateCredential = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name: credentialName } = req.body;

        console.log(`Attempting to update credential with ID: ${id}`);

        // Ensure all fields are provided
        if (!username || !password || !credentialName) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid credential ID:', id);
            return res.status(400).send({ error: 'Invalid credential ID' });
        }

        const credential = await CredentialRepository.findById(id).populate('division');
        if (!credential) {
            console.log('Credential not found:', id);
            return res.status(404).send({ error: 'Credential not found' });
        }

        const userId = req.user._id;
        const userRole = req.user.role;
        console.log(`User ID: ${userId}, User Role: ${userRole}`);

        // Check if the user is part of the division or is a manager/admin
        if (!credential.division.users.includes(userId.toString()) && userRole !== 'Admin' && userRole !== 'Manager') {
            console.log(`User ${userId} is not authorized to update this credential`);
            return res.status(403).send({ error: 'Unauthorized to update this credential' });
        }

        credential.username = username;
        credential.password = password;
        credential.name = credentialName;
        await credential.save();

        res.status(200).send({ message: 'Credential updated successfully', credential });
    } catch (error) {
        console.error('Error updating credential:', error);
        res.status(500).send({ error: 'Error updating credential' });
    }
};

// Delete Credential
exports.deleteCredential = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Attempting to delete credential with ID: ${id}`);

        const credential = await CredentialRepository.findById(id).populate('division');
        if (!credential) {
            console.log(`Credential not found with ID: ${id}`);
            return res.status(404).send({ error: 'Credential not found' });
        }

        const userId = req.user._id;
        const userRole = req.user.role;
        console.log(`User ID: ${userId}, User Role: ${userRole}`);

        // Check if the user is part of the division or is an admin
        if (!credential.division.users.includes(userId.toString()) && userRole !== 'Admin') {
            console.log(`User ${userId} is not authorized to delete this credential`);
            return res.status(403).send({ error: 'Unauthorized to delete this credential' });
        }

        await CredentialRepository.findByIdAndDelete(id);
        console.log(`Credential with ID: ${id} deleted successfully`);

        res.status(200).send({ message: 'Credential deleted successfully' });
    } catch (error) {
        console.error('Error deleting credential:', error);
        res.status(500).send({ error: 'Error deleting credential' });
    }
};
