// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express application
const app = express();

// CORS middleware setup to allow multiple origins
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],  // Allow multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Body parser middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected via Atlas');
}).catch(err => {
    console.log('MongoDB connection error:', err);
});

// Import routes
const routes = require('./routes/routes'); // Consolidated routes
const userRoutes = require('./routes/userRoutes'); // User-specific routes
const divisionRoutes = require('./routes/divisionRoutes'); // Import division routes

// Register routes with the app
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api', divisionRoutes); 

// Simple route for the root path
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Error handling middleware
const { errorHandling } = require('./middleware/errorHandling');
app.use(errorHandling);

// Check for required JWT secret
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set in environment variables.");
    process.exit(1);
}

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
