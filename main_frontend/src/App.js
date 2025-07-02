import React, { useState, useEffect } from 'react';
import './App.css';
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import WorkoutPlan from "./WorkoutPlan";
import ProgressTracker from "./ProgressTracker";
import LevelsSelector from "./LevelsSelector";

/**
 * Main app for FitFlex - SPA with navigation and auth,
 * applying a modern, light dashboard layout.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); // Authenticated user object/null
  const [route, setRoute] = useState("workout"); // 'login' | 'register' | 'profile' | 'workout' | 'progress' | 'levels'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const token = localStorage.getItem("fitflex_token");
    if (token && !user) {
      import("./api").then(api => {
        api.fetchProfile().then(
          u => setUser(u), 
          () => { setUser(null); localStorage.removeItem("fitflex_token"); }
        );
      });
    }
  }, [theme, user]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fitflex_token");
    setRoute("login");
  };

  // PUBLIC_INTERFACE
  const handleLogin = (u) => {
    setUser(u);
    setRoute("workout");
  };

  // PUBLIC_INTERFACE
  const handleRegister = (u) => {
    setUser(u);
    setRoute("workout");
  };

  // Navigation bar for logged-in users, styled for dashboard feel
  function Nav() {
    return (
      <nav className="navbar">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, justifyContent: "center" }}>
          <button className={`btn${route==="workout"?" btn-active":""}`} onClick={() => setRoute("workout")}>Workout Plan</button>
          <button className={`btn${route==="progress"?" btn-active":""}`} onClick={() => setRoute("progress")}>Progress</button>
          <button className={`btn${route==="levels"?" btn-active":""}`} onClick={() => setRoute("levels")}>Levels</button>
          <button className={`btn${route==="profile"?" btn-active":""}`} onClick={() => setRoute("profile")}>Profile</button>
        </div>
        <button className="btn btn-logout" style={{ background: "#d9534f", minWidth: 96 }} onClick={handleLogout}>Logout</button>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>
    );
  }

  // Page-level content for all major routes/screens
  let content;
  if (!user) {
    if (route === "register") {
      content = (
        <Register 
          switchToLogin={() => setRoute("login")} 
          onRegister={handleRegister}
        />
      );
    } else {
      content = (
        <Login 
          switchToRegister={() => setRoute("register")}
          onLogin={handleLogin}
        />
      );
    }
  } else {
    switch (route) {
      case "profile":
        content = <Profile onLogout={handleLogout} />;
        break;
      case "levels":
        content = <LevelsSelector />;
        break;
      case "progress":
        content = <ProgressTracker />;
        break;
      default:
        content = <WorkoutPlan />;
        break;
    }
  }

  return (
    <div className="App">
      {user && <Nav />}
      <main style={{
        margin: "0 auto",
        maxWidth: 900,
        minHeight: user ? "75vh" : "90vh",
        background: "var(--bg-primary)",
        padding: user ? "40px 0 40px 0" : "40px 0 0 0"
      }}>
        {content}
      </main>
      {/* Show theme toggle for login/register too, floating at top right */}
      {!user && (
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 99
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      )}
      <footer style={{
        background: "var(--bg-secondary)",
        color: "#7a7a7a",
        fontSize: 13,
        padding: "16px 0",
        textAlign: "center",
        borderTop: "1.5px solid var(--border-color)",
        marginTop: 42
      }}>
        <span>FitFlex &copy; {new Date().getFullYear()} &mdash; Modern Fitness Hub</span>
      </footer>
    </div>
  );
}

export default App;
