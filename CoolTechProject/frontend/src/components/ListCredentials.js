import React, { useState, useEffect } from 'react';
import { fetchCredentials } from '../services/api';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListCredentials = () => {
    const { divisionId } = useParams(); // Get divisionId from URL params
    const [credentials, setCredentials] = useState([]);
    const [error, setError] = useState('');

    // useEffect hook to fetch credentials data for the specified division when the component mounts or the division ID changes
    useEffect(() => {
        console.log('Division ID:', divisionId); // Debugging line to check divisionId
        const getCredentials = async () => {
            try {
                const data = await fetchCredentials(divisionId);
                console.log('Fetched credentials:', data); // Debugging line
                setCredentials(data.credentials);
            } catch (err) {
                setError(err.message);
                toast.error('Error fetching credentials. Please try again.');
            }
        };

        getCredentials();
    }, [divisionId]);

    return (
        <div>
            <h1>Credentials</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {credentials.map((credential) => (
                    <li key={credential._id}>
                        {credential.credentialName} - {credential.username}
                    </li>
                ))}
            </ul>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default ListCredentials;
