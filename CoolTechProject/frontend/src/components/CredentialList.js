import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCredentials } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CredentialList = () => {
    const { divisionId } = useParams();
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (divisionId) {
            fetchCredentials(divisionId)
                .then(response => {
                    console.log('Fetched credentials:', response); // Log the response
                    setCredentials(response.credentials || response); // Adjust based on actual API response structure
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch credentials:', error);
                    toast.error('Failed to fetch credentials: ' + error.message);
                    setLoading(false);
                });
        } else {
            toast.error('Invalid Division ID');
            setLoading(false);
        }
    }, [divisionId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Credentials</h2>
            {credentials.length > 0 ? (
                <ul>
                    {credentials.map((credential) => (
                        <li key={credential._id}>
                            <p>Username: {credential.username}</p>
                            <p>Credential Name: {credential.name}</p>
                            <Link to={`/divisions/${divisionId}/credentials/${credential._id}/update`}>Update</Link> | 
                            <Link to={`/divisions/${divisionId}/credentials/${credential._id}/delete`}>Delete</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No credentials found.</p>
            )}
            <ToastContainer position="top-center" />
        </div>
    );
};

export default CredentialList;
