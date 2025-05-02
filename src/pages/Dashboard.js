// Import necessary modules
import React, { useContext } from 'react';
import '../styles/Dashboard.css';            // Import dashboard-specific CSS
import { AuthContext } from '../context/AuthContext'; // Import authentication context
import { useNavigate } from 'react-router-dom';       // For redirecting after logout

// ✅ Dashboard Component
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // Get current user and logout function from Auth Context
  const navigate = useNavigate();                   // Create navigation instance for redirection

  // ✅ Handle logout click
  const handleLogout = () => {
    logout();          // Clear user session from context/localStorage
    navigate('/');     // Redirect back to login page
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Welcome Message */}
        <h1>Welcome, {user?.name}!</h1>

        {/* Show user role (student or lecturer) */}
        <p>You are logged in as a <strong>{user?.role}</strong>.</p>

        {/* Logout Button */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;




// ✅ "The Dashboard page welcomes the logged-in user by name."
// ✅ "We display the user's role dynamically, either 'student' or 'lecturer'."
// ✅ "The logout button clears the authentication context and redirects the user back to login."
// ✅ "We use useContext to get authentication data and useNavigate to handle redirection."

// ✅ Very clean and simple explanation!