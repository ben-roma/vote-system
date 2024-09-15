const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const voterSchema = new Schema({
    nip: { type: String, required: true, unique: true },  // Numéro d'identification personnel
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },  // Vérification si l'utilisateur est validé pour voter
}, { timestamps: true });

// Middleware pour hasher le mot de passe avant de sauvegarder
voterSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

// Méthode pour vérifier le mot de passe
voterSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Voter', voterSchema);
