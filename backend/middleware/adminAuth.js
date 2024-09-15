const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, aucun token fourni' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(401).json({ message: 'Accès refusé, administrateur non trouvé' });
        }

        req.admin = admin;  // Ajouter l'admin à la requête pour l'utiliser dans d'autres routes
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
};
