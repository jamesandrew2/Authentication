const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get the authorization header
    if (!authHeader) {
        console.log('Authorization header missing');
        return res.status(401).send({ error: 'Please authenticate.' }); // Respond with an error if the header is missing
    }

    const token = authHeader.replace('Bearer ', ''); // Extract the token from the header
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Token decoded:', decoded);

        const user = await User.findById(decoded.id); // Find the user by ID from the token
        if (!user) {
            throw new Error('User not found'); // Throw an error if the user is not found
        }

        // Attach user details to the request object
        req.user = user;
        req.user.organizationalUnits = decoded.organizationalUnits;
        req.user.divisions = decoded.divisions;
        console.log('User authenticated:', user);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).send({ error: 'Please authenticate.' }); // Respond with an error if token verification fails
    }
};

module.exports = { verifyToken };
