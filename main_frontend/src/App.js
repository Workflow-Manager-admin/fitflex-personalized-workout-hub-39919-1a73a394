import React, { useState, useEffect } from 'react';
import './App.css';
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import WorkoutPlan from "./WorkoutPlan";
import ProgressTracker from "./ProgressTracker";
import LevelsSelector from "./LevelsSelector";

/**
 * Main app for FitFlex - SPA with navigation and auth.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); // Authenticated user object/null
  const [route, setRoute] = useState("workout"); // 'login' | 'register' | 'profile' | 'workout' | 'progress' | 'levels'
  
  // Try to load user from token on mount - in full app, decode or fetch profile
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const token = localStorage.getItem("fitflex_token");
    if (token && !user) {
      // On app refresh, attempt silent login using fetchProfile (no UI for invalid)
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

  // Navigation bar for logged-in users
  function Nav() {
    return (
      <nav className="navbar" style={{ display: "flex", gap: 28, padding: 16, background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", alignItems: "center", justifyContent: "center" }}>
        <button className={`btn${route==="workout"?" btn-active":""}`} onClick={() => setRoute("workout")}>Workout Plan</button>
        <button className={`btn${route==="progress"?" btn-active":""}`} onClick={() => setRoute("progress")}>Progress</button>
        <button className={`btn${route==="levels"?" btn-active":""}`} onClick={() => setRoute("levels")}>Levels</button>
        <button className={`btn${route==="profile"?" btn-active":""}`} onClick={() => setRoute("profile")}>Profile</button>
        <button className="btn btn-logout" style={{ marginLeft: 28, background: "#d9534f" }} onClick={handleLogout}>Logout</button>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ marginLeft: "auto" }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>
    );
  }

  // Route-based content
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
      <main>
        {content}
      </main>
      {!user && (
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      )}
    </div>
  );
}

export default App;
