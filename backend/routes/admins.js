const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Inscription d'un nouvel administrateur
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Vérification des champs
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    try {
        // Vérifier si l'administrateur existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Cet administrateur existe déjà' });
        }

        // Créer un nouvel administrateur
        const newAdmin = new Admin({ name, email, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Administrateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Connexion de l'administrateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    try {
        // Vérifier si l'administrateur existe
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Administrateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
