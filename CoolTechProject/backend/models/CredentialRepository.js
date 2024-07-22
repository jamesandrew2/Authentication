const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the credential schema
const credentialSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { 
    type: String,
    required: true,
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    required: true,
  },
});

// Export the model correctly referencing the defined schema
module.exports = mongoose.model('CredentialRepository', credentialSchema);
