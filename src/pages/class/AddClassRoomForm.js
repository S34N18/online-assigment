import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddClassRoomForm.css';

const AddClassroomForm = ({ onClassroomAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/classrooms',
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setDescription('');
      onClassroomAdded(response.data); // Notify parent to refresh list
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
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Classroom'}
      </button>
    </form>
  );
};

export default AddClassroomForm;
