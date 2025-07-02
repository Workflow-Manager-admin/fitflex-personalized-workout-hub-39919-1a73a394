import React, { useState } from "react";
import { registerUser } from "./api";

/**
 * Registration component for FitFlex.
 * Handles user registration, shows confirmation, handles errors.
 */
// PUBLIC_INTERFACE
function Register({ onRegister, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password || password !== confirm) {
      setError("Please fill all fields and ensure passwords match.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser({ username, email, password });
      localStorage.setItem("fitflex_token", result.token);
      setSuccess(true);
      onRegister(result.user);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: 360, margin: "2rem auto" }}>
        <h2>Registration Successful!</h2>
        <div style={{ margin: "1.5rem 0" }}>Account created for: <strong>{email}</strong></div>
        <button className="btn" onClick={switchToLogin}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 360, margin: "2rem auto" }}>
      <h2>Register for FitFlex</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Username"
          autoComplete="nickname"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          value={confirm}
          required
          onChange={(e) => setConfirm(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 15, fontSize: 15 }}>
        Already have an account?{" "}
        <button type="button" className="btn-link" style={{ color: "#007bff", background: "none", border: 0 }} onClick={switchToLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Register;
