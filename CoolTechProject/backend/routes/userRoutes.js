const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authentication');
const { grantAccess } = require('../middleware/authorization');
const validateObjectId = require('../middleware/validateObjectId');

// Route to assign a user to a division
router.post('/assign', verifyToken, grantAccess('createAny', 'user'), userController.assignUser);

// Route to change a user's role
router.put('/:id/role', verifyToken, validateObjectId('id'), grantAccess('updateAny', 'user'), userController.changeUserRole);

// Route to get the logged-in user's details
router.get('/details', verifyToken, userController.getUserDetails);

// Route to get user details by ID
router.get('/:id', verifyToken, validateObjectId('id'), grantAccess('readAny', 'user'), userController.getUserById);

// Route to get all users
router.get('/', verifyToken, grantAccess('readAny', 'user'), userController.getAllUsers);

module.exports = router;
