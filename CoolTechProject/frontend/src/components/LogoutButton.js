import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout().then(() => {
            navigate('/login'); // Redirect to login page after logout
        });
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
