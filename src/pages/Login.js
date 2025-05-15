import React, { useState, useContext } from 'react';
import axios from 'axios';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Login Page Component
const Login = () => {
  const navigate = useNavigate(); // Used to programmatically navigate to other pages
  const { login } = useContext(AuthContext); // Accessing login function from Auth Context

  // State hooks for form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  //  Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload when submitting

    try {
      // Make POST request to login API
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Extract token and user information from response
      const { token, user } = res.data;

      // Store token and user details in localStorage for session persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update context with logged in user
      login(user, token);

      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      // Display error if login fails (wrong password, wrong email etc.)
      setErrorMsg(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        {/* Display error message if exists */}
        {errorMsg && <p className="error">{errorMsg}</p>}

        {/* Email Input Field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
