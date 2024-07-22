const mongoose = require('mongoose');
const Division = require('../models/Division');
const CredentialRepository = require('../models/CredentialRepository');

// Controller function to add a credential to a division
exports.addCredentialToDivision = async (req, res) => {
    try {
        const { divisionId } = req.params;
        const { username, password, name: credentialName } = req.body;

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).send({ error: 'Division not found' });
        }

        // Correctly instantiate a new CredentialRepository object
        const newCredential = new CredentialRepository({
            username, 
            password, 
            name: credentialName,
            division: divisionId
        });

        await newCredential.save();
        division.credentials.push(newCredential._id);
        await division.save();

        res.status(201).send({ message: 'Credential added successfully', credential: newCredential });
    } catch (error) {
        console.error('Error adding credential:', error);
        res.status(500).send({ error: 'Error adding credential to division' });
    }
};

// Controller function to fetch credentials of a specific division
exports.getCredentialsOfDivision = async (req, res) => {
    try {
        const { divisionId } = req.params;

        // Check if divisionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            console.log('Invalid Division ID:', divisionId);
            return res.status(400).send({ error: 'Invalid Division ID' });
        }

        const division = await Division.findById(divisionId).populate('credentials');
        if (!division) {
            console.log('Division not found:', divisionId);
            return res.status(404).send({ error: 'Division not found' });
        }

        console.log('Fetched credentials for division:', division);
        res.status(200).send({ credentials: division.credentials });
    } catch (error) {
        console.error('Error fetching credentials of division:', error);
        res.status(500).send({ error: 'Error fetching credentials of division' });
    }
};

// Controller function to create a division
exports.createDivision = async (req, res) => {
    try {
        const division = new Division({ ...req.body, users: [req.user._id] });
        await division.save();
        console.log('Division created:', division);
        res.status(201).send(division);
    } catch (error) {
        console.error('Error creating division:', error);
        res.status(400).send({ error: 'Division creation failed.' });
    }
};

// List all divisions (for debugging purposes)
exports.listAllDivisions = async (req, res) => {
    try {
        const divisions = await Division.find({});
        res.status(200).send(divisions);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching divisions' });
    }
};

// Controller function to get all divisions
exports.getDivisions = async (req, res) => {
    try {
        const divisions = await Division.find();
        console.log('Fetched divisions:', divisions);
        res.status(200).json({ divisions });  // Ensure the response is in the expected format
    } catch (error) {
        console.error('Error fetching divisions:', error);
        res.status(500).json({ error: 'Server error fetching divisions' });
    }
};

// Controller function to get a division by ID
exports.getDivisionById = async (req, res) => {
    try {
        const division = await Division.findById(req.params.divisionId);
        if (!division) {
            console.log('Division not found:', req.params.divisionId);
            return res.status(404).send();
        }
        res.status(200).send(division);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controller function to update a division
exports.updateDivision = async (req, res) => {
    try {
        const division = await Division.findByIdAndUpdate(req.params.divisionId, req.body, { new: true, runValidators: true });
        if (!division) {
            console.log('Division not found for update:', req.params.divisionId);
            return res.status(404).send();
        }
        res.status(200).send(division);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Controller function to delete a division
exports.deleteDivision = async (req, res) => {
    try {
        const division = await Division.findByIdAndDelete(req.params.divisionId);
        if (!division) {
            console.log('Division not found for deletion:', req.params.divisionId);
            return res.status(404).send();
        }
        res.status(200).send(division);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Organizational Units are stored
const OU = require('../models/OU');  // Ensure the model is correctly imported

exports.getOrganizationalUnits = async (req, res) => {
    console.log("Fetching organizational units");
    try {
        const organizationalUnits = await OU.find().populate('divisions');
        res.status(200).json(organizationalUnits);
    } catch (error) {
        console.error('Error fetching organizational units:', error);
        res.status(500).json({ error: 'Server error fetching organizational units' });
    }
};
