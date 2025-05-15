import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AssignmentSubmit.css';
import { AuthContext } from '../../context/AuthContext';

const AssignmentSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]); // ✅ Store multiple files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ✅ Fetch assignment details
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignment(res.data);
      } catch (err) {
        console.error('Error loading assignment:', err);
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id, token]);

  // ✅ Handle file input (multiple)
  const handleFileChange = (e) => {
    setFiles([...e.target.files]); // Convert FileList to array
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Please select at least one file to submit');
      return;
    }

    const formData = new FormData();
    formData.append('assignment', id); // ✅ match backend's expected field

    // ✅ Append each file with the key 'files'
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post('/api/submissions', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMsg('Assignment submitted successfully!');
      setFiles([]);

      // Navigate after success
      setTimeout(() => {
        if (assignment.classroomId) {
          navigate(`/classrooms/${assignment.classroomId}`);
        } else {
          navigate('/assignments');
        }
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit assignment');
    }
  };

  if (loading) return <div className="loading">Loading assignment details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assignment) return <div className="error">Assignment not found</div>;

  return (
    <div className="submit-page">
      <h2>Submit Assignment</h2>

      <div className="assignment-details">
        <h3>{assignment.title}</h3>
        <p>{assignment.description}</p>
        <p><strong>Deadline:</strong> {new Date(assignment.deadline).toLocaleDateString()}</p>

        {/* Optional assignment materials */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="assignment-attachment">
            <p><strong>Assignment Files:</strong></p>
            <a 
              href={`/api/files/${assignment.attachments[0].path}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Download Assignment Materials
            </a>
          </div>
        )}
      </div>

      <form className="submission-form" onSubmit={handleSubmit}>
        {successMsg && <p className="success-message">{successMsg}</p>}

        <div className="file-input-container">
          <label htmlFor="submission-file">Upload your work (max 5 files):</label>
          <input 
            type="file"
            id="submission-file"
            onChange={handleFileChange}
            multiple // ✅ allow multiple file selection
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentSubmit;
