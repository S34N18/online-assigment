import React, { useContext } from 'react';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <h1>Welcome, {user?.name}!</h1>
        <p>You are logged in as a <strong>{user?.role}</strong>.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
