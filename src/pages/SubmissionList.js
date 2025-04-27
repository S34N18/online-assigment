import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/SubmissionList.css';
import { AuthContext } from '../context/AuthContext';

const SubmissionList = () => {
  const { token } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/submissions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data.data);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      }
    };

    fetchSubmissions();
  }, [token]);

  return (
    <div className="submission-page">
      <h2>Student Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Date Submitted</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.student?.name}</td>
                <td>{s.assignment?.title}</td>
                <td>{new Date(s.submittedAt).toLocaleString()}</td>
                <td>
                  <a href={`http://localhost:4000/${s.file}`} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionList;
