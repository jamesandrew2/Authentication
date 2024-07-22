import React, { useState, useEffect } from 'react';
import { fetchDivisions, addCredential } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddCredentialForm = () => {
    const [divisions, setDivisions] = useState([]);
    const [credential, setCredential] = useState({ username: '', password: '', name: '' });
    const [selectedDivision, setSelectedDivision] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDivisions();
                console.log('Fetched divisions:', response); // Log the fetched divisions
                setDivisions(response.divisions || response); // Ensure the correct data structure
            } catch (error) {
                toast.error('Error fetching divisions: ' + error.message);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredential({ ...credential, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCredential(selectedDivision, credential);
            toast.success('Credential added successfully');
            navigate(`/divisions/${selectedDivision}/credentials`);
        } catch (error) {
            toast.error('Failed to add credential: ' + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={credential.username} onChange={handleChange} required />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={credential.password} onChange={handleChange} required />
                </label>
                <label>
                    Credential Name:
                    <input type="text" name="name" value={credential.name} onChange={handleChange} required />
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
                <button type="submit">Add Credential</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default AddCredentialForm;
