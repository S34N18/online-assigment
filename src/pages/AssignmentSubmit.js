import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/AssignmentSubmit.css';
import { AuthContext } from '../context/AuthContext';

const AssignmentSubmit = () => {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});
  

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/assignments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(res.data.data);
      } catch (err) {
        console.error('Error loading assignments:', err);
      }
    };
    fetchAssignments();
  }, [token]);

  const handleFileChange = (e, assignmentId) => {
    setFiles({ ...files, [assignmentId]: e.target.files[0] });
  };

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
      {assignments.map((assignment) => (
        <div key={assignment._id} className="submit-card">
          <h3>{assignment.title}</h3>
          <input type="file" onChange={(e) => handleFileChange(e, assignment._id)} />
          <button onClick={() => handleSubmit(assignment._id)}>Submit</button>
        </div>
      ))}
    </div>
  );
};

export default AssignmentSubmit;
