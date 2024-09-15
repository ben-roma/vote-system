const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
