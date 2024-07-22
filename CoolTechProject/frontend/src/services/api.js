import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:5000/api';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add the token to the Authorization header for all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.error('Token not found in local storage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Logout function
export const logout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    return Promise.resolve(); // Simulate an async operation
};

export const fetchOrganizationalUnits = async () => {
    try {
        const response = await api.get('/organizational-units');
        console.log('API Response for fetchOrganizationalUnits:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching organizational units:', error);
        return []; // Return an empty array on error for safe handling in frontend logic
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', response.data.token); // Store the token in local storage
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Login failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw new Error('Registration failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const fetchCredentials = async (divisionId) => {
    try {
        const response = await api.get(`/divisions/${divisionId}/credentials`);
        console.log('API Response for fetchCredentials:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching credentials for division:', divisionId, error);
        throw new Error('Error fetching credentials: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const addCredential = async (divisionId, credentialData) => {
    try {
        const response = await api.post(`/divisions/${divisionId}/credentials`, credentialData);
        return response.data;
    } catch (error) {
        console.error('Error adding credential:', error);
        throw new Error('Adding credential failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const updateCredential = async (credentialId, credentialData) => {
    try {
        const response = await api.put(`/credentials/${credentialId}`, credentialData);
        return response.data;
    } catch (error) {
        console.error('Error updating credential:', credentialId, error);
        throw new Error('Updating credential failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const fetchCredentialById = async (credentialId) => {
    try {
        const response = await api.get(`/credentials/${credentialId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching credential by ID:', credentialId, error);
        throw new Error('Fetching credential failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const deleteCredential = async (credentialId) => {
    try {
        const response = await api.delete(`/credentials/${credentialId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting credential:', credentialId, error);
        throw new Error('Deleting credential failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const fetchDivisions = async () => {
    try {
        const response = await api.get('/divisions');
        console.log('API Response for fetchDivisions:', response.data); // Log the API response
        return response.data; // Ensure this returns an array
    } catch (error) {
        console.error('Error fetching divisions:', error);
        return []; // Return an empty array on error
    }
};

export const assignUser = async (userData) => {
    try {
        const response = await api.post('/users/assign', userData);
        return response.data;
    } catch (error) {
        console.error('Error assigning user:', error);
        throw new Error('Assigning user failed: ' + (error.response ? error.response.data.error : 'Something went wrong'));
    }
};

export const changeUserRole = async (userId, newRole) => {
    console.log('Changing role for user:', userId, 'to new role:', newRole);
    try {
        const response = await api.put(`/users/${userId}/role`, { newRole });
        return response.data;
    } catch (error) {
        console.error('Error changing user role:', userId, error);
        throw new Error('Changing user role failed: ' + (error.response ? error.response.data.error : 'Something went wrong'));
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data.user; // Ensure this returns the user object
    } catch (error) {
        console.error('Error fetching user by ID:', userId, error);
        throw new Error('Fetching user failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

// Fetch all users
export const fetchAllUsers = async () => {
    try {
        console.log("Fetching all users from", `${API_URL}/users`);
        const response = await api.get('/users');
        console.log("Fetched users:", response.data.users);
        return response.data.users; // Ensure this returns the users array
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Fetching users failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};

export const getUserDetails = async () => {
    try {
        const response = await api.get('/users/details');
        console.log('API Response for getUserDetails:', response.data);
        return response.data.user; // Ensure this returns the user object
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Fetching user details failed: ' + (error.response ? error.response.data.error : 'Server did not respond'));
    }
};
