import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ClassroomList = () => {
  const { user } = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/classrooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassrooms(response.data);
      } catch (err) {
        setError('Failed to fetch classrooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'lecturer') {
      fetchClassrooms();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p>Loading classrooms...</p>;
  if (error) return <p>{error}</p>;
  if (classrooms.length === 0) return <p>You have no classrooms.</p>;

  return (
    <ul>
      {classrooms.map((classroom) => (
        <li key={classroom._id}>
          <strong>{classroom.name}</strong> — {classroom.description}
        </li>
      ))}
    </ul>
  );
};

export default ClassroomList;
