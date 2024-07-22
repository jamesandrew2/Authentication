import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';  // Corrected the import path

const Login = () => {
    // State variables to manage username and password inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Handler for form submission to log in the user
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await loginUser(username, password);
            if (response.token) {
                localStorage.setItem('token', response.token); // Store the token in localStorage
                toast.success('Login successful!');
                navigate('/'); // Navigate to the home page
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="login-button">Login</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default Login;
