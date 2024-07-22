const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const { verifyToken } = require('../middleware/authentication');
const { grantAccess } = require('../middleware/authorization');

// Route to add a new credential
router.post('/divisions/:divisionId/credentials', verifyToken, grantAccess('createOwn', 'credential'), credentialController.addCredential);

// Route to list credentials for a division
router.get('/divisions/:divisionId/credentials', verifyToken, grantAccess('readOwn', 'credential'), credentialController.listCredentials);

// Route to get a specific credential by ID
router.get('/:id', verifyToken, grantAccess('readOwn', 'credential'), credentialController.getCredentialById);

// Route to update a credential by ID
router.put('/:id', verifyToken, grantAccess('updateOwn', 'credential'), credentialController.updateCredential);

// Route to delete a credential by ID
router.delete('/:id', verifyToken, grantAccess('deleteOwn', 'credential'), credentialController.deleteCredential);

module.exports = router;
