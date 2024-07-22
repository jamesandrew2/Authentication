const mongoose = require('mongoose');

const validateObjectId = (param) => {
    return (req, res, next) => {
        const value = req.params[param];
        console.log(`Validating ObjectId for ${param}: ${value}`);
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return res.status(400).send({ error: `Invalid ${param} ID` });
        }
        next();
    };
};

module.exports = validateObjectId;
