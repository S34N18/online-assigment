import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ClassroomDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch classroom details and its assignments
  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        // Fetch classroom details
        const classroomRes = await axios.get(`/api/classrooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassroom(classroomRes.data);
        
        // Fetch classroom assignments
        const assignmentsRes = await axios.get(`/api/classrooms/${id}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(assignmentsRes.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch classroom details:', err);
        setError('Failed to load classroom details. Please try again later.');
        setLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id, token]);

  if (loading) return <div className="loading">Loading classroom details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!classroom) return <div className="error">Classroom not found</div>;

  return (
    <div className="classroom-details-container">
      <div className="classroom-header">
        <h2>{classroom.name}</h2>
        <div className="classroom-meta">
          <span className="classroom-code">Code: {classroom.code}</span>
          {classroom.lecturerId && (
            <span className="classroom-lecturer">
              Lecturer: {classroom.lecturerId.name || 'Unknown'}
            </span>
          )}
        </div>
      </div>

      {classroom.description && (
        <div className="classroom-description">
          <h3>Description</h3>
          <p>{classroom.description}</p>
        </div>
      )}

      {/* Management options for lecturers */}
      {(user?.role === 'lecturer' || user?.role === 'admin') && (
        <div className="classroom-management">
          <h3>Classroom Management</h3>
          <div className="management-buttons">
            <Link to={`/classrooms/${id}/manage`} className="button">
              Manage Students
            </Link>
            <Link to={`/classrooms/${id}/assignments/create`} className="button">
              Create Assignment
            </Link>
          </div>
        </div>
      )}

      {/* Assignments section */}
      <div className="classroom-assignments">
        <h3>Assignments</h3>
        {assignments.length === 0 ? (
          <p>No assignments have been created for this classroom yet.</p>
        ) : (
          <div className="assignment-list">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <h4>{assignment.title}</h4>
                {assignment.description && (
                  <p className="assignment-description">{assignment.description}</p>
                )}
                
                <div className="assignment-meta">
                  <span className="due-date">
                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="assignment-actions">
                  {user?.role === 'student' && (
                    <Link to={`/assignments/${assignment._id}/submit`} className="button">
                      Submit Assignment
                    </Link>
                  )}
                  
                  {(user?.role === 'lecturer' || user?.role === 'admin') && (
                    <Link to={`/assignments/${assignment._id}/submissions`} className="button">
                      View Submissions
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Students list for lecturers */}
      {(user?.role === 'lecturer' || user?.role === 'admin') && classroom.students && (
        <div className="classroom-students">
          <h3>Students</h3>
          {classroom.students.length === 0 ? (
            <p>No students have joined this classroom yet.</p>
          ) : (
            <ul className="student-list">
              {classroom.students.map((student) => (
                <li key={student._id} className="student-item">
                  {student.name} ({student.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassroomDetails;