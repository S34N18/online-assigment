import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../pages/styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2 className="logo">AssignmentSys</h2>

      <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
      <NavLink to="/assignments" activeclassname="active">Assignments</NavLink>

      {user?.role === 'student' && (
        <NavLink to="/submit-assignment" activeclassname="active">Submit Assignment</NavLink>
      )}

      {user?.role === 'lecturer' && (
        <>
          <NavLink to="/create-assignment" activeclassname="active">Create Assignment</NavLink>
          <NavLink to="/users" activeclassname="active">Users</NavLink>
          <NavLink to="/submissions" activeclassname="active">Submissions</NavLink>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
