const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Pour protéger la route avec JWT
const Candidate = require('../models/Candidate'); // Import du modèle Candidate

// Route protégée : Ajouter un candidat
router.post('/add-candidate', auth, async (req, res) => {
    const { name, party, description } = req.body;

    // Vérification des données
    if (!name || !party) {
        return res.status(400).json({ message: 'Le nom et le parti sont requis' });
    }

    try {
        const newCandidate = new Candidate({
            name,
            party,
            description
        });

        // Enregistrer le candidat dans la base de données
        await newCandidate.save();
        res.status(201).json({ message: 'Candidat ajouté avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route pour lister tous les candidats
router.get('/list', auth, async (req, res) => {
    try {
        // Récupérer tous les candidats dans la base de données
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
