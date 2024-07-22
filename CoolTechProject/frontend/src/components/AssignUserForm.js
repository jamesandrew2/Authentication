import React, { useState, useEffect } from 'react';
import { fetchDivisions, assignUser } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignUserForm = () => {
    // State variables to manage divisions, selected division, and user ID
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [userId, setUserId] = useState('');

    // useEffect hook to fetch divisions data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDivisions();
                setDivisions(response.divisions);
            } catch (error) {
                toast.error('Failed to fetch divisions');
            }
        };
        fetchData();
    }, []);

    // Handler for form submission to assign a user to a division
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignUser({ userId, divisionId: selectedDivision });
            toast.success('User assigned successfully');
        } catch (error) {
            toast.error('Failed to assign user');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    User ID:
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                </label>
                <label>
                    Division:
                    <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} required>
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                            <option key={division._id} value={division._id}>
                                {division.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Assign User</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default AssignUserForm;
