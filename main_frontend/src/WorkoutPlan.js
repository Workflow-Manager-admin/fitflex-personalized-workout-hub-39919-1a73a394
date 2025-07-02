import React, { useEffect, useState } from "react";
import { fetchWorkoutPlan } from "./api";

/**
 * Weekly workout plan view.
 * Fetches & displays the user's personalized plan.
 */
// PUBLIC_INTERFACE
function WorkoutPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchWorkoutPlan()
      .then(data => setPlan(data))
      .catch(e => setError(e.message || "Unable to load workout plan"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading workout plan...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!plan) return <div>No plan data available.</div>;

  // Example plan: { week: [ { day: 'Monday', exercises: [ ... ] }, ... ] }
  return (
    <div className="container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Your Weekly Workout Plan</h2>
      {plan.week && plan.week.length > 0 ? (
        <table className="plan-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {plan.week.map((day, i) => (
              <tr key={i}>
                <td>{day.day}</td>
                <td>
                  <ul style={{ margin: 0, padding: 0 }}>
                    {day.exercises.map((ex, j) => (
                      <li key={j}>
                        <strong>{ex.name}</strong>: {ex.sets} sets x {ex.reps} reps {ex.rest ? ` | Rest ${ex.rest}s` : ""}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div>No weekly plan found.</div>}
    </div>
  );
}

export default WorkoutPlan;
