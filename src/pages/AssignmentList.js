import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/AssignmentList.css';
import { AuthContext } from '../context/AuthContext';

const AssignmentList = () => {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/assignments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAssignments(res.data.data);
      } catch (err) {
        console.error('Failed to fetch assignments', err);
      }
    };

    fetchAssignments();
  }, [token]);

  return (
    <div className="assignment-list">
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <ul>
          {assignments.map(assignment => (
            <li key={assignment._id} className="assignment-card">
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p><strong>Deadline:</strong> {new Date(assignment.deadline).toLocaleDateString()}</p>
              {assignment.file && (
                <a href={`http://localhost:4000/${assignment.file}`} target="_blank" rel="noopener noreferrer">Download</a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentList;
