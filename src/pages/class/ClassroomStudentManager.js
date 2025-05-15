import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClassroomStudentManager = ({ classroomId, token }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch classroom details
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await axios.get(`/api/classrooms/${classroomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
      } catch (err) {
        console.error('Failed to fetch classroom:', err);
      }
    };

    fetchClassroom();
  }, [classroomId, token]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleRemoveStudents = async () => {
    try {
      await axios.put(
        `/api/classrooms/remove-students/${classroomId}`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudents((prev) => prev.filter((s) => !selectedStudents.includes(s._id)));
      setSelectedStudents([]);
      alert('Students removed successfully');
    } catch (err) {
      console.error('Failed to remove students:', err);
      alert('Failed to remove students');
    }
  };

  return (
    <div>
      <h3>Classroom Students</h3>
      {students.length === 0 ? (
        <p>No students in this classroom.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student._id)}
                onChange={() => handleCheckboxChange(student._id)}
              />
              {student.name} ({student.email})
            </li>
          ))}
        </ul>
      )}

      {selectedStudents.length > 0 && (
        <button onClick={handleRemoveStudents} style={{ marginTop: '10px' }}>
          Remove Selected
        </button>
      )}
    </div>
  );
};

export default ClassroomStudentManager;



// ✔️ Fetches students for a specific classroom.

// ✔️ Allows checkbox selection of students.

// ✔️ Handles removal with PUT request.

// ✔️ UI is clean and functional.