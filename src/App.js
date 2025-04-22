import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssignmentList from './pages/AssignmentList';
import AssignmentSubmit from './pages/AssignmentSubmit';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/submit-assignment" element={<AssignmentSubmit />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
