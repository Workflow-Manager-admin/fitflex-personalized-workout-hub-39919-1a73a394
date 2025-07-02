import React, { useState } from "react";
import { loginUser } from "./api";

/**
 * Login component for FitFlex.
 * Handles user login, forwards token to localStorage, displays errors.
 */
// PUBLIC_INTERFACE
function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser({ email, password });
      localStorage.setItem("fitflex_token", result.token); // Store JWT
      onLogin(result.user); // Propagate successful login
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 360, margin: "2rem auto" }}>
      <h2>Login to FitFlex</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 15, fontSize: 15 }}>
        Don't have an account?{" "}
        <button type="button" className="btn-link" style={{ color: "#007bff", background: "none", border: 0 }} onClick={switchToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
