const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Référence à l'utilisateur (électeur)
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },  // Référence au candidat
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },  // Référence à l'élection
    timestamp: { type: Date, default: Date.now }  // Date et heure du vote
}, { timestamps: true });

module.exports = mongoose.model('Vote', voteSchema);
