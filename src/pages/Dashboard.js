// Import necessary modules
import React, { useContext } from 'react';
import './styles/Dashboard.css';            // Import dashboard-specific CSS
import { AuthContext } from '../context/AuthContext'; // Import authentication context
import { useNavigate } from 'react-router-dom';       // For redirecting after logout
import ClassroomList from './class/ClassroomList';

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
  <h1>Welcome, {user?.name}!</h1>
  <p>You are logged in as a <strong>{user?.role}</strong>.</p>

  {/* Lecturer-specific content */}
  {user?.role === 'lecturer' && (
    <div style={{ marginTop: '20px' }}>
      <h2>Your Classrooms</h2>
      <ClassroomList token={user.token} />
    </div>
  )}

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