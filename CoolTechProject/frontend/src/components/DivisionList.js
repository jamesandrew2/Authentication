import React, { useState, useEffect } from 'react';
import { fetchDivisions } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DivisionList = () => {
    // State variable to manage the list of divisions
    const [divisions, setDivisions] = useState([]);

    // useEffect hook to fetch divisions data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDivisions();
                setDivisions(response.divisions);
            } catch (error) {
                toast.error('Error fetching divisions');
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Divisions</h2>
            <ul>
                {divisions.map((division) => (
                    <li key={division._id}>{division.name}</li>
                ))}
            </ul>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default DivisionList;
