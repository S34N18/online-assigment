import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './styles/Users.css';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  // Grab the auth token from context for protected requests
  const { token } = useContext(AuthContext);

  // Store all users fetched from the API
  const [users, setUsers] = useState([]);

  // Form state for creating a new user
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',       // Default role
    studentId: ''          // Optional, only used if role is student
  });

  // Fetch users from backend API
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }  // Attach token to header
      });
      setUsers(res.data.data);  // Save response data to state
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  // Run fetchUsers on component mount and whenever the token changes
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Handle form input changes (for controlled form inputs)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission to create a new user
  const handleCreate = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await axios.post('http://localhost:4000/api/users', form, {
        headers: { Authorization: `Bearer ${token}` }  // Secure the request
      });
      fetchUsers();  // Refresh the user list
      setForm({ name: '', email: '', password: '', role: 'student', studentId: '' });  // Clear form
    } catch (err) {
      alert(err.response?.data?.message || 'User creation failed');
    }
  };

  return (
    <div className="users-page">
      <h2>User Management</h2>

      {/* User creation form */}
      <form onSubmit={handleCreate} className="user-form">
        <h3>Create New User</h3>

        {/* Input for full name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />

        {/* Input for email */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        {/* Input for password */}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {/* Dropdown for user role selection */}
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          
          
        </select>

        {/* Only show Student ID input if the role is 'student' */}
        {form.role === 'student' && (
          <input
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            placeholder="Student ID"
            required={form.role === 'student'} // Only required if role is student
          />
        )}

        <button type="submit">Create User</button>
      </form>

      {/* List of all users */}
      <div className="user-list">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.studentId || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
