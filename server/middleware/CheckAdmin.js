// Firebase auth
const { auth } = require('../config/Firebase');

const CheckAdmin = async (req, res, next) => {
    const { uid } = req.params;

    auth.getUser(uid).then(userRecord => {
        if (userRecord.customClaims && userRecord.customClaims['admin']) {
            req.isAdmin = true;
            return next();
        }

        req.isAdmin = false;

        return next();
    });
};

module.exports = CheckAdmin;
