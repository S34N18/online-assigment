import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../styles/AssignmentList.css";
import { AuthContext } from "../../context/AuthContext";

const AssignmentList = () => {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // NEW: Track which assignment is expanded

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/assignments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(res.data.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    fetchAssignments();
  }, [token]);

  // ✅ Toggle expand/collapse
  const handleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="assignment-list">
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              className={`assignment-card ${
                expandedId === assignment._id ? "expanded" : ""
              }`}
              onClick={() => handleExpand(assignment._id)}
            >
              <h3>
                {assignment.title} {expandedId === assignment._id ? "⬆️" : "⬇️"}
              </h3>

              {/* Show description and deadline if expanded */}
              {expandedId === assignment._id && (
                <>
                  <p>{assignment.description}</p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </p>

                  {/* Show download link if there is a file */}
                  {assignment.attachments &&
                    assignment.attachments.length > 0 && (
                      <a
                        href={`http://localhost:4000/${assignment.attachments[0].path
                          .replace(/\\/g, "/")
                          .trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Attachment
                      </a>
                    )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentList;

// ✅ "This page fetches a list of assignments from the backend once the user is logged in."
// ✅ "We send a token in the request headers because the API is protected."
// ✅ "Each assignment shows its title, description, deadline, and a download link if available."
// ✅ "If no assignments exist, we show a simple 'No assignments found' message."

// ✅ Clean, simple, and professional!
