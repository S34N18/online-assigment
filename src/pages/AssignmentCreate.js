// Import necessary modules
import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/AssignmentCreate.css';  // Import CSS for styling
import { AuthContext } from '../context/AuthContext';  // Import Authentication context

// ✅ Assignment Create Component
const AssignmentCreate = () => {
  const { token } = useContext(AuthContext); // Get the token from Auth Context

  // State to manage form input fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  // State to manage file upload
  const [file, setFile] = useState(null);

  // State to show success message
  const [successMsg, setSuccessMsg] = useState('');

  // ✅ Handle changes in input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store only the first file selected
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Prepare data to send
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('deadline', form.deadline);
    if (file) formData.append('file', file); // Attach file if selected

    try {
      // Send POST request to backend to create assignment
      await axios.post('http://localhost:4000/api/assignments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Send token for authentication
          'Content-Type': 'multipart/form-data'
        }
      });

      // Clear the form after success
      setForm({ title: '', description: '', deadline: '' });
      setFile(null);
      setSuccessMsg('Assignment created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment'); // Alert user on failure
    }
  };

  return (
    <div className="create-assignment-page">
      <form className="assignment-form" onSubmit={handleSubmit}>
        <h2>Create Assignment</h2>

        {/* Show success message if assignment is created */}
        {successMsg && <p className="success">{successMsg}</p>}

        {/* Assignment Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Assignment Title"
          required
        />

        {/* Assignment Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Assignment Description"
          required
        />

        {/* Assignment Deadline */}
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
        />

        {/* File Upload */}
        <input type="file" onChange={handleFileChange} />

        {/* Submit Button */}
        <button type="submit">Publish Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentCreate;



// ✅ "This page allows lecturers to create a new assignment by filling in a form."
// ✅ "We handle form data and file uploads using FormData object and send it using Axios."
// ✅ "Only authenticated users with a valid token can create assignments."
// ✅ "On successful creation, the form clears and a success message appears."

// "I used consistent spacing, rounded corners, and light colors to create a clean and user-friendly UI. Focus effects on inputs improve interactivity. Success messages are styled softly to keep a positive user experience."