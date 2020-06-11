const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    if (!authHeader.startsWith('Bearer')) {
        // Reject if there is no Bearer in the token
        req.isAuth = false;
        return next();
    }
    const accessToken = authHeader.split(' ')[1];

    let decodedAccessToken;

    try {
        decodedAccessToken = jwt.verify(accessToken, 'somesupersecretsecret');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedAccessToken || !decodedAccessToken.userId) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedAccessToken.userId;
    req.isAuth = true;
    next();
};
