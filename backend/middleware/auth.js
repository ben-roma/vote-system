const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, aucun token fourni' });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'secretKey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token invalide' });
    }
};

