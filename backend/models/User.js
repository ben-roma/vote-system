const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nip: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false  // False par défaut, sauf pour l'administrateur
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
