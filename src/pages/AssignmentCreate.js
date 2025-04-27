import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/AssignmentCreate.css';
import { AuthContext } from '../context/AuthContext';

const AssignmentCreate = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [file, setFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('deadline', form.deadline);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:4000/api/assignments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setForm({ title: '', description: '', deadline: '' });
      setFile(null);
      setSuccessMsg('Assignment created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment');
    }
  };

  return (
    <div className="create-assignment-page">
      <form className="assignment-form" onSubmit={handleSubmit}>
        <h2>Create Assignment</h2>
        {successMsg && <p className="success">{successMsg}</p>}

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Assignment Title"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Assignment Description"
          required
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
        />

        <input type="file" onChange={handleFileChange} />

        <button type="submit">Publish Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentCreate;
