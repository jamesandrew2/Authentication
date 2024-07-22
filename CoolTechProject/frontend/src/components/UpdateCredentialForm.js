import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCredentialById, updateCredential } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateCredentialForm = () => {
    const { id } = useParams();
    const [credential, setCredential] = useState({ username: '', password: '', credentialName: '' });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredential({ ...credential, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCredential(id, credential);
            toast.success('Credential updated successfully');
            navigate(`/divisions/${divisionId}/credentials`);
        } catch (error) {
            toast.error('Failed to update credential: ' + error.message);
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
                    <input type="text" name="credentialName" value={credential.credentialName} onChange={handleChange} required />
                </label>
                <button type="submit">Update Credential</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default UpdateCredentialForm;
