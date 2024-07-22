# Authentication
CoolTechProject is an internal web app designed for managing various credentials across multiple organizational units and divisions within Cool Tech. Built using the MERN stack, it includes robust user authentication and role-based access control.

# Features

User Registration and Login
Role-based Access Control
Normal Users: Read and add credentials.
Management Users: Read, add, and update credentials.
Admin Users: Assign/unassign users to divisions and OUs, change user roles.
Credential Management
View credentials by division.
Add new credentials.
Update existing credentials.
Project Structure

# Backend
The backend is organized into the following directories:

config
roles.js: Defines user roles and permissions.
controllers
authController.js: Handles authentication.
credentialController.js: Manages credential operations.
divisionController.js: Manages division operations.
userController.js: Manages user operations.
middleware
authentication.js: Verifies JWT tokens.
authorization.js: Checks user permissions.
errorHandling.js: Handles errors.
models
CredentialRepository.js
Division.js
OU.js
User.js
routes
authRoutes.js: Routes for authentication.
credentialRoutes.js: Routes for credential operations.
divisionRoutes.js: Routes for division operations.
userRoutes.js: Routes for user operations.
Other Files
.env: Environment variables.
package.json: Dependencies.
package-lock.json: Lock file for dependencies.
seed.js: Seeds the database with initial data.
server.js: Main server file.

# Frontend
The frontend is organized into the following directories:

# public
favicon.ico
index.html
logo192.png
logo512.png
manifest.json
robots.txt

# src
components
AddCredentialForm.js
AssignUserForm.js
ChangeUserRoleForm.js
CredentialList.js
DeleteCredentialForm.js
DivisionList.js
ListCredential.js
Login.js
Register.js
UpdateCredentialForm.js

# styles
login.css
register.css
services
api.js
App.js
App.css
index.js
index.css
README.md
package.json
package-lock.json

# Setup

# Prerequisites
Node.js
MongoDB

## Backend
Navigate to the backend directory:
cd backend

# Install dependencies:
npm install

# Create a .env file and add the necessary environment variables:
Rename the "env" file in the repo to ".env"

# Seed the database:
node seed.js

# Start the server:
npm start

## Frontend

# Navigate to the frontend directory:
cd frontend

# Install dependencies:
npm install

# Start the development server:
npm start

# Usage

Register a new user or login with an existing account.
Depending on your role, perform the following operations:
Normal Users: View and add credentials.
Management Users: View, add, and update credentials.
Admin Users: Assign/unassign users to divisions and OUs, change user roles.
Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

# License

This project is licensed under the MIT License.

# Contact

For any questions or feedback, please contact James at james.alison18@gmail.com

This project was created as a capstone project for HyperionDev, utilizing the MERN stack to build a secure and efficient credential management system for Cool Tech.
