import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../styles/SubmissionList.css";
import { AuthContext } from "../context/AuthContext";

const SubmissionList = () => {
  const { token } = useContext(AuthContext); // get auth token from context
  const [submissions, setSubmissions] = useState([]); // initialize as empty array to avoid length error

  // fetch submissions from backend on mount
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data.data); // store retrieved data
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };

    fetchSubmissions();
  }, [token]);

  return (
    <div className="submission-page">
      <h2>Student Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Date Submitted</th>
              <th>File(s)</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.student?.name || "Unknown Student"}</td>
                <td>{s.assignment?.title || "Untitled Assignment"}</td>
                <td>{new Date(s.submittedAt).toLocaleString()}</td>
                <td>
                  {Array.isArray(s.files) && s.files.length > 0
                    ? s.files.map((file, idx) => (
                        <div key={idx}>
                          <a
                            href={`http://localhost:4000/${file.path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {file.filename || `File ${idx + 1}`}
                          </a>
                        </div>
                      ))
                    : "No files"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionList;
