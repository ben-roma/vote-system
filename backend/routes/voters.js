const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');

// Route pour enregistrer un électeur
router.post('/register', async (req, res) => {
    const { nip, email, password } = req.body;

    // Vérification des champs
    if (!nip || !email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    try {
        // Vérifier si l'électeur existe déjà
        const existingVoter = await Voter.findOne({ email });
        if (existingVoter) {
            return res.status(400).json({ message: 'Cet électeur est déjà enregistré' });
        }

        // Créer un nouvel électeur
        const newVoter = new Voter({ nip, email, password });
        await newVoter.save();

        res.status(201).json({ message: 'Électeur enregistré avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route pour la connexion d'un électeur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    try {
        // Vérifier si l'électeur existe
        const voter = await Voter.findOne({ email });
        if (!voter) {
            return res.status(400).json({ message: 'Électeur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await voter.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Vérifier si l'électeur est vérifié
        if (!voter.isVerified) {
            return res.status(403).json({ message: 'Votre compte n\'est pas encore vérifié pour voter' });
        }

        // Générer un token JWT
        const token = jwt.sign({ voterId: voter._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
