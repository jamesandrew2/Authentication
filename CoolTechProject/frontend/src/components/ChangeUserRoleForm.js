import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, changeUserRole } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeUserRoleForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [newRole, setNewRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching users in ChangeUserRoleForm");
                const response = await fetchAllUsers();
                console.log("Fetched users:", response);
                setUsers(response);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error('Failed to fetch users');
            }
        };
        fetchData();
    }, []);

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
    };

    const handleRoleChange = (e) => {
        setNewRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changeUserRole(selectedUserId, newRole);
            toast.success('User role updated successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to change user role');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Select User:
                    <select value={selectedUserId} onChange={handleUserChange} required>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.username} ({user.role})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    New Role:
                    <input type="text" value={newRole} onChange={handleRoleChange} required />
                </label>
                <button type="submit">Change Role</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default ChangeUserRoleForm;
