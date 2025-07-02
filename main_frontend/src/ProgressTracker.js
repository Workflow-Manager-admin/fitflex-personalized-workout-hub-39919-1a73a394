import React, { useState, useEffect } from "react";
import { fetchProgress, submitProgress } from "./api";

/**
 * Progress tracking dashboard for FitFlex.
 * Shows progress for the week and allows updating completion.
 */
// PUBLIC_INTERFACE
function ProgressTracker() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load progress data
  useEffect(() => {
    setLoading(true);
    fetchProgress()
      .then(setProgress)
      .catch((e) => setError(e.message || "Could not fetch progress"))
      .finally(() => setLoading(false));
  }, []);

  // PUBLIC_INTERFACE
  const handleToggleComplete = async (entry) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await submitProgress({
        day: entry.day,
        completed: !entry.completed,
      });
      setProgress(updated);
      setSuccess(
        `Progress for ${entry.day} marked as ${
          !entry.completed ? "complete" : "incomplete"
        }`
      );
    } catch (e) {
      setError(e.message || "Could not update progress");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading progress...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!progress || !progress.week) return <div>No progress data.</div>;

  return (
    <div className="container" style={{ maxWidth: 540, margin: "2rem auto" }}>
      <h2>Your Workout Progress</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Completed</th>
            <th>Notes</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {progress.week.map((entry, i) => (
            <tr key={i}>
              <td>{entry.day}</td>
              <td>
                {entry.completed ? (
                  <span style={{ color: "green" }}>✓</span>
                ) : (
                  <span style={{ color: "grey" }}>✗</span>
                )}
              </td>
              <td>{entry.notes || ""}</td>
              <td>
                <button
                  className="btn"
                  disabled={saving}
                  onClick={() => handleToggleComplete(entry)}
                >
                  Mark {entry.completed ? "Incomplete" : "Complete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {success && <div style={{ color: "green" }}>{success}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default ProgressTracker;
