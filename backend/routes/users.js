const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('../models/User');

// Route d'inscription
router.post('/register', async (req, res) => {
    const { nip, email, password } = req.body;

    // Vérification des données
    if (!nip || !email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            nip,
            email,
            password: hashedPassword
        });

        // Enregistrer l'utilisateur
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { nip, password } = req.body;

    // Vérification des données
    if (!nip || !password) {
        return res.status(400).json({ message: 'Veuillez fournir le NIP et le mot de passe' });
    }

    try {
        // Rechercher l'utilisateur par son NIP
        const user = await User.findOne({ nip });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un JWT
        const token = jwt.sign(
            { userId: user._id, nip: user.nip },
            process.env.JWT_SECRET || 'secretKey',  // Assure-toi de définir une clé secrète dans ton .env
            { expiresIn: '1h' }
        );

        // Répondre avec le token
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
