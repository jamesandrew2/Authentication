const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  credentials: [{
    type: Schema.Types.ObjectId,
    ref: 'CredentialRepository',
  }],
});

const Division = mongoose.model('Division', divisionSchema);
module.exports = Division;
