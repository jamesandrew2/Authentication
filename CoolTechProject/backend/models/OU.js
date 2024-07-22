const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ouSchema = new Schema({
  name: { type: String, required: true },
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }]
});

module.exports = mongoose.model('OU', ouSchema);
