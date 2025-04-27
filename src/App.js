import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
 import Dashboard from './pages/Dashboard';
 import AssignmentCreate from './pages/AssignmentCreate.js';
 import AssignmentList from './pages/AssignmentList';
 import AssignmentSubmit from './pages/AssignmentSubmit';
 import Users from './pages/Users.js';
import SubmissionList from './pages/SubmissionList.js';
import ProtectedLayout from './components/ProtectedLayout.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />

         <Route path="/dashboard" element={<PrivateRoute><ProtectedLayout><Dashboard/></ProtectedLayout></PrivateRoute>  } />
         <Route path="/create-assignment" element={<PrivateRoute><AssignmentCreate/></PrivateRoute>} />
         <Route path="/submissions" element={<PrivateRoute><SubmissionList/></PrivateRoute>} />

        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/submit-assignment" element={<AssignmentSubmit />} />
       <Route path="/users" element={<Users />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
