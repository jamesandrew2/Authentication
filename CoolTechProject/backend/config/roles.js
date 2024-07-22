const AccessControl = require('accesscontrol');
const ac = new AccessControl();

// Define roles and permissions
ac.grant('Normal')
  .readOwn('credential')
  .createOwn('credential')
  .readOwn('division');

ac.grant('Manager')
  .extend('Normal')
  .updateOwn('credential');

ac.grant('Admin')
  .extend('Manager')
  .deleteOwn('credential')
  .createAny('credential')
  .updateAny('credential')
  .deleteAny('credential')
  .readAny('credential')
  .readAny('division')
  .createOwn('division') 
  .createAny('division') 
  .updateAny('division') 
  .deleteAny('division')
  .createAny('user')  // Admin can create any user
  .updateAny('user')  // Admin can update any user
  .readAny('user')    // Admin can read any user
  .deleteAny('user'); // Admin can delete any user

module.exports = { ac }; // Ensure ac is exported correctly
