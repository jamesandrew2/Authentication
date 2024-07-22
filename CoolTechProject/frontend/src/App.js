import React, { createContext, useContext, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CredentialList from './components/CredentialList';
import AddCredentialForm from './components/AddCredentialForm';
import UpdateCredentialForm from './components/UpdateCredentialForm';
import DeleteCredentialForm from './components/DeleteCredentialForm';
import ChangeUserRoleForm from './components/ChangeUserRoleForm';
import AssignUserForm from './components/AssignUserForm';
import LogoutButton from './components/LogoutButton'; // Import the LogoutButton component
import { getUserDetails } from './services/api';

// Create a UserContext to share the user's info across components
const UserContext = createContext(null);

// Component that provides user data to its children
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails = await getUserDetails(); // Call the function to fetch user details
                console.log('Fetched user details:', userDetails); // Log the fetched user details
                setUser(userDetails);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

// Main App component
function App() {
    return (
        <Router>
            <UserProvider>
                <div className="App">
                    <header className="App-header">
                        <h1>Cool Tech Credential Manager</h1>
                        <nav>
                            <Link to="/">Home</Link> |{" "}
                            <Link to="/login">Login</Link> |{" "}
                            <Link to="/register">Register</Link> |{" "}
                            <UserLink label="Add Credential" base="/divisions/" suffix="/credentials/add" /> |{" "}
                            <UserLink label="View Credentials" base="/divisions/" suffix="/credentials" /> |{" "}
                            <Link to="/assign-user">Assign User</Link> |{" "}
                            <UserLink label="Change User Role" base="/users/" suffix="/change-role" isUser /> |{" "}
                            <LogoutButton /> {/* Add the logout button here */}
                        </nav>
                    </header>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<p>Welcome to the Cool Tech Credential Manager</p>} />
                        <Route path="/divisions/:divisionId/credentials" element={<CredentialList />} />
                        <Route path="/divisions/:divisionId/credentials/add" element={<AddCredentialForm />} />
                        <Route path="/divisions/:divisionId/credentials/:id/update" element={<UpdateCredentialForm />} />
                        <Route path="/divisions/:divisionId/credentials/:id/delete" element={<DeleteCredentialForm />} />
                        <Route path="/users/:id/change-role" element={<ChangeUserRoleForm />} />
                        <Route path="/assign-user" element={<AssignUserForm />} />
                    </Routes>
                </div>
            </UserProvider>
        </Router>
    );
}

// Component to render links based on user's context
function UserLink({ label, base, suffix, isUser }) {
    const user = useContext(UserContext);
    console.log('User context:', user); // Log the user context for debugging

    const divisionId = user?.divisions?.[0]?._id || user?.divisions?.[0]; // Ensure we are getting the division ID correctly
    const userId = user?._id;

    // Log the values of divisionId and userId for debugging
    console.log('User divisionId:', divisionId);
    console.log('User userId:', userId);

    const linkPath = user 
        ? `${base}${isUser ? userId : divisionId}${suffix}`
        : "/";

    console.log('Link path:', linkPath); // Log the constructed link path for debugging
    
    return <Link to={linkPath}>{label}</Link>;
}

export default App;
