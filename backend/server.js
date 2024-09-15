const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/users');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');
const electionRoutes = require('./routes/elections');
const adminRoutes = require('./routes/admins');
const voterRoutes = require('./routes/voters');

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes JSON
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/voting_system', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Route par défaut
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routes API
app.use('/api/users', userRoutes);

// Utilisation des routes candidates
app.use('/api/candidates', candidateRoutes);

// Utilisation des routes pour les votes
app.use('/api/votes', voteRoutes);

// Utilisation des routes pour les élections
app.use('/api/elections', electionRoutes);

// Utilisation des routes pour les administrateurs
app.use('/api/admins', adminRoutes);


// Utilisation des routes pour les électeurs
app.use('/api/voters', voterRoutes);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
