// Updated App.js with general submissions route
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AssignmentCreate from "./pages/Assignment/AssignmentCreate.js";
import AssignmentList from "./pages/Assignment/AssignmentList.js";
import AssignmentSubmit from "./pages/Assignment/AssignmentSubmit.js";
import Users from "./pages/Users.js";
import SubmissionList from "./pages/SubmissionList.js";
import ProtectedLayout from "./components/ProtectedLayout.js";
import ManageStudentWrapper from "./pages/class/ManageStudentWrapper.js";
import ClassroomList from "./pages/class/ClassroomList.js";
import ClassroomDetails from "./pages/class/ClasssroomDetails.js";
import AssignmentDetails from "./pages/Assignment/AssignmentDetails.js";




function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        {/* Classroom Routes */}
        <Route
          path="/classrooms"
          element={
            <PrivateRoute>
              <ClassroomList />
            </PrivateRoute>
          }
        />
        <Route
          path="/classrooms/:id"
          element={
            <PrivateRoute>
              <ClassroomDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/classrooms/:id/manage"
          element={
            <PrivateRoute>
              <ManageStudentWrapper />
            </PrivateRoute>
          }
        />

        {/* Assignment Routes */}
        <Route
          path="/classrooms/:classroomId/assignments/create"
          element={
            <PrivateRoute>
              <AssignmentCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute>
              <AssignmentList />
            </PrivateRoute>
          }
        />

       <Route 
       path="/assignments/:assignmentId"
        element={
          <PrivateRoute>
            <AssignmentDetails />
          </PrivateRoute>
        }
      />






        <Route
          path="/assignments/:id/submit"
          element={
            <PrivateRoute>
              <AssignmentSubmit />
            </PrivateRoute>
          }
        />

        {/* Submissions Routes */}
        <Route
          path="/assignments/:assignmentId/submissions"
          element={
            <PrivateRoute>
              <SubmissionList />
            </PrivateRoute>
          }
        />
        
        {/* Add this general submissions route */}
        <Route
          path="/submissions"
          element={
            <PrivateRoute>
              <SubmissionList />
            </PrivateRoute>
          }
        />

        {/* User Management */}
        <Route path="/users" element={<Users />} />
        
        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;