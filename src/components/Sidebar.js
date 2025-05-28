import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../pages/styles/Sidebar.css'; // Import your CSS file for styling

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close sidebar when clicking on a nav link (mobile)
  const handleNavClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <>
      <h2 className="logo">AssignmentSys</h2>

      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? "active" : ""}
        onClick={handleNavClick}
      >
        Dashboard
      </NavLink>

      <NavLink 
        to="/assignments" 
        className={({ isActive }) => isActive ? "active" : ""}
        onClick={handleNavClick}
      >
        Assignments
      </NavLink>

      {/* Student-specific routes */}
      {user?.role === 'student' && (
        <>
          <NavLink 
            to="/my-classes" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            My Classes
          </NavLink>
          <NavLink 
            to="/submissions" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            My Submissions
          </NavLink>
          <NavLink 
            to="/grades" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Grades & Feedback
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Profile
          </NavLink>
        </>
      )}

      {/* Lecturer-specific routes */}
      {user?.role === 'lecturer' && (
        <>
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Users
          </NavLink>
          <NavLink 
            to="/submissions" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Submissions
          </NavLink>
          <NavLink 
            to="/classrooms" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            Classrooms
          </NavLink>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default Sidebar;