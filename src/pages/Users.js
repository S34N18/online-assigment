import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/Users.css';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  fetchUsers();
}, [token]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/users', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      setForm({ name: '', email: '', password: '', role: 'student', studentId: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'User creation failed');
    }
  };

  return (
    <div className="users-page">
      <h2>User Management</h2>

      <form onSubmit={handleCreate} className="user-form">
        <h3>Create New User</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>

        {form.role === 'student' && (
          <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="Student ID" required />
        )}

        <button type="submit">Create User</button>
      </form>

      <div className="user-list">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
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
