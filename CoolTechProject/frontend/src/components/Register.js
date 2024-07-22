import React, { useState, useEffect } from 'react';
import { registerUser, fetchOrganizationalUnits } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [organizationalUnits, setOrganizationalUnits] = useState([]);
    const [selectedOU, setSelectedOU] = useState('');
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const ouData = await fetchOrganizationalUnits();
                if (ouData.length > 0) {
                    setOrganizationalUnits(ouData);
                    setSelectedOU(ouData[0]._id);
                    setDivisions(ouData[0].divisions);
                    setSelectedDivision(ouData[0].divisions[0]._id);
                } else {
                    toast.error('No organizational units found.');
                }
            } catch (error) {
                toast.error('Failed to fetch organizational units.');
                console.error('Error fetching organizational units:', error);
            }
        };
        loadInitialData();
    }, []);

    const handleOUChange = (event) => {
        const selectedOU = organizationalUnits.find(ou => ou._id === event.target.value);
        setSelectedOU(selectedOU._id);
        setDivisions(selectedOU.divisions);
        setSelectedDivision(selectedOU.divisions[0]._id);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        const userData = {
            username,
            password,
            organizationalUnit: selectedOU,
            division: selectedDivision,
            role: 'normal'  // Default role
        };
        try {
            const response = await registerUser(userData);
            if (response.user) {
                toast.success('Registration successful');
                navigate('/login');
            } else {
                toast.error(response.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </label>
                <label>
                    Organizational Unit:
                    <select value={selectedOU} onChange={handleOUChange}>
                        {organizationalUnits.map((ou) => <option key={ou._id} value={ou._id}>{ou.name}</option>)}
                    </select>
                </label>
                <label>
                    Division:
                    <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
                        {divisions.map((division) => <option key={division._id} value={division._id}>{division.name}</option>)}
                    </select>
                </label>
                <button type="submit" className="register-button">Register</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default Register;
