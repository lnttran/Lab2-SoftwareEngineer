const jwt = require('jsonwebtoken');

const APP_SECRET = "CS7328";

const verifyJWT = (req, res, next) => {
    const jwtKey = req.body.jwt;

    jwt.verify(jwtKey, APP_SECRET, function (err, decoded) {
        if (!err) {
            res.locals.decoded = decoded; // Attach the decoded data to the request object
            next(); // Call the next middleware
        } else if (err.name === 'TokenExpiredError') {
            res.status(401).send('Error, token expired');
        } else {
            res.status(401).send('Error, invalid token');
        }
    });
};

module.exports = verifyJWT;
