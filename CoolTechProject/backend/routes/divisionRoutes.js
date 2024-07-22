const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/divisionController');
const { verifyToken } = require('../middleware/authentication');
const { grantAccess } = require('../middleware/authorization');

// POST method to create a division
router.post('/', verifyToken, grantAccess('createOwn', 'division'), divisionController.createDivision);

// GET method to fetch divisions
router.get('/', verifyToken, grantAccess('readOwn', 'division'), divisionController.getDivisions);

// POST method to add credentials to a division
router.post('/:divisionId/credentials', verifyToken, grantAccess('createOwn', 'credential'), divisionController.addCredentialToDivision);

// GET method to fetch credentials of a specific division
router.get('/:divisionId/credentials', verifyToken, grantAccess('readOwn', 'credential'), divisionController.getCredentialsOfDivision);

// New route for fetching all organizational units
router.get('/organizational-units', divisionController.getOrganizationalUnits);

// Other routes for division
router.get('/:divisionId', verifyToken, grantAccess('readOwn', 'division'), divisionController.getDivisionById);
router.put('/:divisionId', verifyToken, grantAccess('updateOwn', 'division'), divisionController.updateDivision);
router.delete('/:divisionId', verifyToken, grantAccess('deleteOwn', 'division'), divisionController.deleteDivision);

module.exports = router;
