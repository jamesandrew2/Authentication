import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCredentialById, deleteCredential } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteCredentialForm = () => {
    const { id } = useParams();
    const [credential, setCredential] = useState(null);
    const [divisionId, setDivisionId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCredentialById(id);
                setCredential(response);
                setDivisionId(response.division);
            } catch (error) {
                toast.error('Failed to fetch credential: ' + error.message);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteCredential(id);
            toast.success('Credential deleted successfully');
            navigate(`/divisions/${divisionId}/credentials`);
        } catch (error) {
            toast.error('Failed to delete credential: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Delete Credential</h2>
            {credential && (
                <div>
                    <p>Are you sure you want to delete the credential:</p>
                    <p>Username: {credential.username}</p>
                    <p>Credential Name: {credential.name}</p>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
            <ToastContainer position="top-center" />
        </div>
    );
};

export default DeleteCredentialForm;
