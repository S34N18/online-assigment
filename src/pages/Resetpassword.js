import React, { useState } from 'react';
import axios from 'axios';
import './styles/Resetpassword.css';

const ResetPassword = ({ email, onBackToForgot, onBackToLogin, onResetSuccess }) => {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Clear messages
  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Validate password strength
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 100) {
      return 'Password is too long';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    // Validate all fields are filled
    if (!resetCode || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Validate reset code format (should be 6 digits)
    if (!/^\d{6}$/.test(resetCode)) {
      setErrorMsg('Reset code should be 6 digits');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMsg(passwordError);
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: email,
        passwordResetCode: resetCode,
        newPassword: newPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccessMsg('Password reset successfully! You can now login with your new password.');
      
      // Wait for user to see success message, then redirect to login
      setTimeout(() => {
        onResetSuccess();
      }, 2000);

    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMsg(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: email
      });
      setSuccessMsg('New reset code sent to your email!');
    } catch (error) {
      setErrorMsg('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <p className="reset-password-description">
          Enter the 6-digit code sent to <strong>{email}</strong> and create a new password.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Display messages */}
          {errorMsg && <div className="error-message">{errorMsg}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          {/* Reset Code Input */}
          <div className="input-group">
            <label htmlFor="reset-code">Reset Code</label>
            <input
              id="reset-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={resetCode}
              onChange={(e) => {
                // Only allow numbers and limit to 6 characters
                const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                setResetCode(value);
              }}
              required
              disabled={isLoading}
              className="code-input"
              maxLength="6"
              pattern="\d{6}"
            />
          </div>

          {/* New Password Input */}
          <div className="input-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type={showPasswords ? "text" : "password"}
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
              className="password-input"
              minLength="6"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="password-input"
              minLength="6"
            />
          </div>

          {/* Show/Hide Password Toggle */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                disabled={isLoading}
              />
              Show passwords
            </label>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button 
              type="submit" 
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          {/* Additional Actions */}
          <div className="additional-actions">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="link-button"
            >
              Resend Code
            </button>
            
            <button
              type="button"
              onClick={onBackToForgot}
              disabled={isLoading}
              className="link-button"
            >
              Change Email
            </button>
            
            <button
              type="button"
              onClick={onBackToLogin}
              disabled={isLoading}
              className="link-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;