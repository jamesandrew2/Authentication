const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Normal', 'Manager', 'Admin'], // Add all valid roles here
        default: 'Normal'
    },
    organizationalUnits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationalUnit' // Reference to OrganizationalUnit model
    }],
    divisions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division' // Reference to Division model
    }]
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
