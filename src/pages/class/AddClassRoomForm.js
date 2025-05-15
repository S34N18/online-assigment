import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddClassRoomForm.css';

const AddClassroomForm = ({ onClassroomAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState(''); // Add code state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/classrooms',
        { name, description, code }, // Include code in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setDescription('');
      setCode(''); // Reset code
      setSuccess('Classroom added successfully!');
      onClassroomAdded(response.data); // notify parent to refresh

      // Clear the success message after a delay
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to add classroom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-classroom-form">
      <h3>Add New Classroom</h3>

      <input
        type="text"
        placeholder="Classroom Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Classroom Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Classroom'}
      </button>
    </form>
  );
};

export default AddClassroomForm;