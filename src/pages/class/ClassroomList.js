import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AddClassroomForm from './AddClassRoomForm';

const ClassroomList = () => {
  const { user } = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch classrooms
  const fetchClassrooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/classrooms', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setClassrooms(response.data);
    } catch (err) {
      // More detailed error handling
      const errorMsg = err.response?.data?.message || 'Failed to fetch classrooms';
      setError(errorMsg);
      console.error('Classroom fetch error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'lecturer' || user?.role === 'admin') {
      fetchClassrooms();
    } else {
      setLoading(false); // skip fetching for other roles
    }
  }, [user]);

  // Enhanced error and loading states
  if (loading) return <div className="loading">Loading classrooms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classroom-list-container">
      {(user?.role === 'lecturer') && (
        <div className="add-classroom-section">
          <AddClassroomForm onClassroomAdded={fetchClassrooms} />
        </div>
      )}

      <h3>{user?.role === 'lecturer' ? 'Your Classrooms' : 'All Classrooms'}</h3>

      {classrooms.length === 0 ? (
        <p className="no-classrooms">
          {user?.role === 'lecturer' 
            ? 'You have not created any classrooms yet.' 
            : 'No classrooms are available.'}
        </p>
      ) : (
        <div className="classrooms-grid">
          {classrooms.map((classroom) => (
            <div key={classroom._id} className="classroom-card">
              <div className="classroom-header">
                <h4>{classroom.name}</h4>
                <span className="classroom-code">Code: {classroom.code}</span>
              </div>
              
              {classroom.description && (
                <p className="classroom-description">
                  {classroom.description}
                </p>
              )}

              {classroom.lecturerId && (
                <div className="classroom-lecturer">
                  <small>
                    Lecturer: {classroom.lecturerId.name || 'Unknown'}
                  </small>
                </div>
              )}

              {user?.role === 'lecturer' && (
                <div className="classroom-actions">
                  <Link 
                    to={`/classrooms/${classroom._id}`} 
                    className="view-classroom-link"
                  >
                    View Classroom Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomList;