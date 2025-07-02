import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "./api";

/**
 * User Profile component.
 * Allows viewing/editing user's profile data.
 */
// PUBLIC_INTERFACE
function Profile({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProfile();
        setProfile(data);
        setForm({ ...data });
      } catch (err) {
        setError(err.message || "Could not load profile.");
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // PUBLIC_INTERFACE
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setEditing(false);
      setSuccess("Profile updated!");
    } catch (err) {
      setError(err.message || "Update failed");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (!profile) return <div>No profile data.</div>;

  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Profile</h2>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label>
          Username:
          <input
            disabled={!editing}
            name="username"
            type="text"
            value={form.username || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            disabled
            name="email"
            type="email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </label>
        {/* Add more fields if backend contract supports them */}
        {editing ? (
          <>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn" type="button" onClick={() => { setEditing(false); setForm(profile); }}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn" type="button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
        <button className="btn" style={{ marginTop: "20px", background: "#d9534f" }} type="button" onClick={onLogout}>
          Logout
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
    </div>
  );
}

export default Profile;
