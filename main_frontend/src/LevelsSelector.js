import React, { useState, useEffect } from "react";
import { fetchLevels, setUserLevel } from "./api";

/**
 * User workout level (beginner/advanced) selector component.
 * Loads levels from backend; allows update.
 */
// PUBLIC_INTERFACE
function LevelsSelector({ currentLevel, onChange }) {
  const [levels, setLevels] = useState([]);
  const [selected, setSelected] = useState(currentLevel || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchLevels()
      .then(data => {
        setLevels(data.levels || data); // API: array or {levels: [...]}
        setLoading(false);
      })
      .catch(e => { setError("Failed to load levels"); setLoading(false); });
  }, []);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await setUserLevel({ level: selected });
      setStatus(`Level set to "${selected}"!`);
      if (onChange) onChange(selected);
    } catch (err) {
      setError(err.message || "Error setting level.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading levels...</div>;

  return (
    <div className="container" style={{ maxWidth: 320, margin: "2rem auto" }}>
      <h2>Choose Your Workout Level</h2>
      {levels.length === 0 && <div>No levels found.</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} disabled={saving || levels.length === 0}>
          <option value="">Select level...</option>
          {levels.map((lvl, i) => (
            <option value={lvl.name || lvl} key={i}>
              {(lvl.name || lvl) + (lvl.description ? ` - ${lvl.description}` : "")}
            </option>
          ))}
        </select>
        <button type="submit" className="btn" disabled={saving || !selected}>
          {saving ? "Saving..." : "Set Level"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {status && <div style={{ color: "green" }}>{status}</div>}
      </form>
    </div>
  );
}

export default LevelsSelector;
