//
// FitFlex Frontend API Service Layer
// This module centralizes HTTP calls to the backend REST API specified in the contract.
//
// Features covered: Auth, Profile, Workouts, Levels, Progress
// Uses backend base URL from environment variable `REACT_APP_API_BASE_URL` (see .env).
//
// PUBLIC INTERFACES documented with docstrings.
//

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
const getToken = () => localStorage.getItem('fitflex_token');

/**
 * Helper for making requests.
 */
async function request(endpoint, options = {}, requireAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (requireAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    let message = "Unknown error";
    try {
      const errData = await response.json();
      message = errData.message || JSON.stringify(errData);
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

// ================== AUTH ==================

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 * @param {Object} data { username, email, password }
 * @returns {Promise<Object>} User info + JWT token
 */
export async function registerUser(data) {
  /** Register API: POST /users/register */
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUBLIC_INTERFACE
 * Log in an existing user.
 * @param {Object} data { email, password }
 * @returns {Promise<Object>} User info + JWT token
 */
export async function loginUser(data) {
  /** Login API: POST /users/login */
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ================== PROFILE ==================

/**
 * PUBLIC_INTERFACE
 * Fetch currently logged-in user's profile.
 * @returns {Promise<Object>} User profile info
 */
export async function fetchProfile() {
  /** GET /profile */
  return request("/profile", {}, true);
}

/**
 * PUBLIC_INTERFACE
 * Update user profile.
 * @param {Object} data Profile data to update
 * @returns {Promise<Object>} Updated profile info
 */
export async function updateProfile(data) {
  /** PUT /profile */
  return request("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  }, true);
}

// ================== WORKOUTS ==================

/**
 * PUBLIC_INTERFACE
 * Fetch user's personalized weekly workout plan.
 * @returns {Promise<Object>} Workout plan data
 */
export async function fetchWorkoutPlan() {
  /** GET /workouts/plan */
  return request("/workouts/plan", {}, true);
}

/**
 * PUBLIC_INTERFACE
 * Fetch all possible workout levels.
 * @returns {Promise<Object>} Array of available levels/descriptions
 */
export async function fetchLevels() {
  /** GET /levels */
  return request("/levels", {}, false);
}

/**
 * PUBLIC_INTERFACE
 * Set (update) current user's workout level.
 * @param {Object} data { level }
 * @returns {Promise<Object>} Success/status
 */
export async function setUserLevel(data) {
  /** POST /levels/select */
  return request("/levels/select", {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
}

// ================== PROGRESS ==================

/**
 * PUBLIC_INTERFACE
 * Fetch progress data for current user.
 * @returns {Promise<Object>} Progress/analytics info
 */
export async function fetchProgress() {
  /** GET /progress */
  return request("/progress", {}, true);
}

/**
 * PUBLIC_INTERFACE
 * Submit/update a workout progress entry.
 * @param {Object} data { day, completed: boolean, notes (optional) }
 * @returns {Promise<Object>} Updated progress data
 */
export async function submitProgress(data) {
  /** POST /progress */
  return request("/progress", {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
}
