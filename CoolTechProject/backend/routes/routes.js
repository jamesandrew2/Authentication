const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const credentialRoutes = require('./credentialRoutes');
const divisionRoutes = require('./divisionRoutes');
module.exports = function (app) {
    app.use(divisionRoutes);
};
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/credentials', credentialRoutes);
router.use('/divisions', divisionRoutes); // This registers the division routes
router.use('/users', userRoutes);

module.exports = router;
