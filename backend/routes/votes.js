const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Middleware d'authentification
const Vote = require('../models/Vote');  // Modèle Vote
const Candidate = require('../models/Candidate');  // Modèle Candidat
const Election = require('../models/Election');  // Modèle Election
const voteContract = require('../web3');

// Route pour enregistrer un vote
router.post('/vote', auth, async (req, res) => {
    const { candidateId, electionId } = req.body;

    try {
        // Récupérer le voterId depuis le token JWT
        const voterId = req.user.userId;

        // Vérifier si l'élection existe
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(400).json({ message: 'Élection non trouvée' });
        }

        // Vérifier si le candidat existe et s'il fait partie de l'élection
        const candidate = await Candidate.findById(candidateId);
        if (!candidate || !election.candidates.includes(candidateId)) {
            return res.status(400).json({ message: 'Candidat non trouvé ou non valide pour cette élection' });
        }

        // Vérifier si l'utilisateur a déjà voté dans cette élection
        const existingVote = await Vote.findOne({ voterId, electionId });
        if (existingVote) {
            return res.status(400).json({ message: 'Vous avez déjà voté dans cette élection' });
        }

        // Créer un nouveau vote
        const newVote = new Vote({
            voterId,  // L'utilisateur connecté
            candidateId,
            electionId
        });

        // Enregistrer le vote dans la base de données
        await newVote.save();
        res.status(201).json({ message: 'Vote enregistré avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route pour enregistrer un vote via la blockchain
router.post('/voteBlockchain', auth, async (req, res) => {
    const { candidateId } = req.body;

    try {
        const accounts = await web3.eth.getAccounts();
        await voteContract.methods.vote(candidateId).send({ from: accounts[0] });

        res.status(200).json({ message: 'Vote enregistré sur la blockchain' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors du vote sur la blockchain' });
    }
});

router.post('/addCandidate', auth, async (req, res) => {
    const { candidateName } = req.body;

    try {
        const accounts = await web3.eth.getAccounts();
        await voteContract.methods.addCandidate(candidateName).send({ from: accounts[0] });  // L'admin utilise le premier compte de Ganache

        res.status(200).json({ message: 'Candidat ajouté avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du candidat' });
    }
});

module.exports = router;
