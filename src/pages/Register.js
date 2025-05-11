// Importing necessary modules
import React, { useState } from 'react';
import axios from 'axios';
import './styles/Register.css';
import { useNavigate } from 'react-router-dom';

// ✅ Register Component
const Register = () => {
  const navigate = useNavigate(); // Used for page redirection after successful registration

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',    // Default role is student
    studentId: ''        // Only required for students
  });

  // State to hold any error message
  const [errorMsg, setErrorMsg] = useState('');

  // ✅ Handle input changes and update the formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    try {
      // Send registration data to backend
      await axios.post('http://localhost:4000/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`  // Only lecturers can register new users
        }
      });

      // Redirect to login page after successful registration
      navigate('/');
    } catch (error) {
      // Show error message if registration fails
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>

        {/* Display error message if any */}
        {errorMsg && <p className="error">{errorMsg}</p>}

        {/* Full Name Input */}
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email Input */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>

        {/* Show Student ID input only if "Student" role is selected */}
        {formData.role === 'student' && (
          <input
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        )}

        {/* Submit Button */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;



//  "This page allows a lecturer to register new students or lecturers."
//  "We store the form data inside the component using React's useState hook."
//  "When the form is submitted, we send the data to the backend with Axios."
//  "After registration, the user is redirected back to the login page."
//  "If there is an error (e.g., email already exists), we show it immediately."


// "I used CSS Flexbox to center the forms vertically and horizontally. I added smooth animations for better user experience. I also used Poppins font and soft gradients to make the app feel professional."