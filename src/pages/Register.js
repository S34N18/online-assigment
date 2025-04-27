import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}

        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>

        {formData.role === 'student' && (
          <input name="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} required />
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
