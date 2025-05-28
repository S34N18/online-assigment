import React, { useState, useContext } from 'react';
import axios from 'axios';
import './styles/Login.css'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Login Page Component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // State hooks for form inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: code + new password

  // Clear messages when switching between forms
  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Login Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    // Debug logging to identify the issue
    console.log('=== FRONTEND LOGIN DEBUG ===');
    console.log('Email state:', email);
    console.log('Password state:', password);
    console.log('Password length:', password?.length);
    console.log('Password type:', typeof password);
    console.log('Form data being sent:', { email, password });

    // Validate form data before sending
    if (!email || !password) {
      setErrorMsg('Please provide both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        email: email.trim(),
        password: password
      };

      console.log('Request data:', requestData);

      const res = await axios.post('http://localhost:5000/api/auth/login', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', res.data);

      // Your backend returns { success, message, token, data } 
      const { token, data: user } = res.data;

      // Update context with logged in user
      login(user, token);

      setSuccessMsg('Login successful! Redirecting...');
      
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      setErrorMsg(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Step 1: Send Reset Code
  const handleForgotPasswordEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    if (!forgotEmail) {
      setErrorMsg('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: forgotEmail.trim()
      });

      setSuccessMsg('Password reset code sent to your email!');
      setForgotPasswordStep(2);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Step 2: Reset Password with Code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    // Validate form data
    if (!resetCode || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: forgotEmail.trim(),
        passwordResetCode: resetCode,
        newPassword: newPassword
      });

      setSuccessMsg('Password reset successful! You can now login with your new password.');
      
      // Reset form and go back to login
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setForgotEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        clearMessages();
      }, 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset forgot password form
  const resetForgotPasswordForm = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    clearMessages();
  };

  return (
    <div className="login-page">
      {!showForgotPassword ? (
        // Main Login Form
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>

          {/* Display messages */}
          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          {/* Email Input Field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              console.log('Email input changed:', e.target.value);
              setEmail(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          {/* Password Input Field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              console.log('Password input changed:', e.target.value);
              setPassword(e.target.value);
            }}
            required
            disabled={isLoading}
          />

          {/* Submit Button */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Forgot Password Link */}
          <p className="forgot-password-link">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="link-button"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </p>
        </form>
      ) : (
        // Forgot Password Form
        <div className="forgot-password-form">
          {forgotPasswordStep === 1 ? (
            // Step 1: Enter Email
            <form onSubmit={handleForgotPasswordEmail}>
              <h2>Forgot Password</h2>
              <p>Enter your email address to receive a password reset code.</p>

              {/* Display messages */}
              {errorMsg && <p className="error">{errorMsg}</p>}
              {successMsg && <p className="success">{successMsg}</p>}

              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              {/* Buttons */}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
              
              <button
                type="button"
                onClick={resetForgotPasswordForm}
                className="secondary-button"
                disabled={isLoading}
              >
                Back to Login
              </button>
            </form>
          ) : (
            // Step 2: Enter Reset Code and New Password
            <form onSubmit={handleResetPassword}>
              <h2>Reset Password</h2>
              <p>Enter the reset code sent to your email and your new password.</p>

              {/* Display messages */}
              {errorMsg && <p className="error">{errorMsg}</p>}
              {successMsg && <p className="success">{successMsg}</p>}

              {/* Reset Code Input */}
              <input
                type="text"
                placeholder="Enter reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                disabled={isLoading}
              />

              {/* New Password Input */}
              <input
                type="password"
                placeholder="New password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />

              {/* Confirm Password Input */}
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />

              {/* Buttons */}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <button
                type="button"
                onClick={() => setForgotPasswordStep(1)}
                className="secondary-button"
                disabled={isLoading}
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={resetForgotPasswordForm}
                className="link-button"
                disabled={isLoading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;