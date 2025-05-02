// Import necessary modules
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/AssignmentSubmit.css'; // Import CSS
import { AuthContext } from '../context/AuthContext'; // Auth context

// ✅ Assignment Submit Component
const AssignmentSubmit = () => {
  const { user, token } = useContext(AuthContext); // Get current user and token
  const [assignments, setAssignments] = useState([]); // Store assignments list
  const [files, setFiles] = useState({}); // Store selected files for each assignment

  // ✅ Fetch assignments on page load
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/assignments', {
          headers: { Authorization: `Bearer ${token}` } // Pass token for protected route
        });
        setAssignments(res.data.data); // Save assignments
      } catch (err) {
        console.error('Error loading assignments:', err);
      }
    };
    fetchAssignments();
  }, [token]);

  // ✅ Handle file input change
  const handleFileChange = (e, assignmentId) => {
    setFiles({ ...files, [assignmentId]: e.target.files[0] }); // Track selected file per assignment
  };

  // ✅ Handle assignment file submission
  const handleSubmit = async (assignmentId) => {
    if (!files[assignmentId]) return alert('Please choose a file');

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('file', files[assignmentId]);

    try {
      await axios.post('http://localhost:4000/api/submissions', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Submission successful!');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed.');
    }
  };

  return (
    <div className="submit-page">
      <h2>Submit Assignments</h2>

      {/* List all assignments */}
      {assignments.map((assignment) => (
        <div key={assignment._id} className="submit-card">
          <h3>{assignment.title}</h3>

          {/* File input */}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, assignment._id)}
          />

          {/* Submit button */}
          <button onClick={() => handleSubmit(assignment._id)}>Submit</button>
        </div>
      ))}
    </div>
  );
};

export default AssignmentSubmit;


// ✅ "Students see a list of available assignments."
// ✅ "They can upload a file and submit it directly for each assignment."
// ✅ "We use FormData to upload files because it's multipart data."
// ✅ "We protect submission routes with tokens to ensure only logged-in students can submit."

// ✅ Very professional and simple to explain!