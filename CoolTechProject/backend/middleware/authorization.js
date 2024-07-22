const { ac } = require('../config/roles');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            // Generate the correct action method based on action type
            const actionMethod = action.endsWith('Any') || action.endsWith('Own') ? action : `${action}Any`;
            console.log(`User role: ${req.user.role}, action: ${actionMethod}, resource: ${resource}`);

            // Check and log the available permissions for the user's role
            const rolePermissions = ac.can(req.user.role);
            console.log(`Available permissions for role ${req.user.role}:`, rolePermissions);

            // Check if the action method exists for the user's role
            if (!rolePermissions[actionMethod]) {
                console.log(`Action method not found in AccessControl: ${actionMethod}`);
                return res.status(403).json({ error: "Action method not available" });
            }

            // Retrieve the permission for the action and resource
            const permission = rolePermissions[actionMethod](resource);
            console.log(`Permission granted: ${permission.granted}`);

            // If permission is not granted, deny access
            if (!permission.granted) {
                console.log('Permission denied');
                return res.status(403).json({ error: "You don't have enough permission to perform this action" });
            }
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'An error occurred while checking permissions' }); // Handle errors
        }
    };
};

module.exports = { grantAccess };
