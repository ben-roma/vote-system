const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    title: { type: String, required: true },  // Nom de l'élection
    description: { type: String },
    startDate: { type: Date, required: true },  // Date de début de l'élection
    endDate: { type: Date, required: true },  // Date de fin de l'élection
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],  // Liste des candidats participant à cette élection
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
