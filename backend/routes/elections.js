const express = require('express');
const router = express.Router();
//const auth = require('../middleware/auth');  // Middleware d'authentification
const Election = require('../models/Election');  // Modèle Election
const Candidate = require('../models/Candidate');  // Modèle Candidat
const adminAuth = require('../middleware/adminAuth');

// Route pour créer une nouvelle élection
router.post('/create', adminAuth, async (req, res) => {
    const { title, description, startDate, endDate, candidates } = req.body;

    // Vérification des données
    if (!title || !startDate || !endDate || !candidates || candidates.length === 0) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises' });
    }

    try {
        // Vérifier que les candidats existent
        const existingCandidates = await Candidate.find({ '_id': { $in: candidates } });
        if (existingCandidates.length !== candidates.length) {
            return res.status(400).json({ message: 'Certains candidats sont invalides' });
        }

        // Créer une nouvelle élection
        const newElection = new Election({
            title,
            description,
            startDate,
            endDate,
            candidates
        });

        // Enregistrer l'élection dans la base de données
        await newElection.save();
        res.status(201).json({ message: 'Élection créée avec succès', election: newElection });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});


// Route pour lister toutes les élections
router.get('/list', async (req, res) => {
    try {
        const elections = await Election.find().populate('candidates');  // Utilisation de populate pour obtenir les informations des candidats
        res.status(200).json(elections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
