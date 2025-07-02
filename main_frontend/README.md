# FitFlex Main Frontend

This project is the user-facing React web application for FitFlex, allowing fitness enthusiasts to generate, view, and track personalized workout plans.

## Features

- **User registration and authentication**
- **Dynamic weekly workout plan generation**
- **Experience level selection (beginner/intermediate/advanced)**
- **Reps and sets breakdown per exercise**
- **Progress tracking dashboard**
- **Modern, responsive UI**

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)
- The `workout_backend` container must be running and accessible.

### 2. Environment Setup

This app uses an environment variable for the backend API URL. **You must create a `.env` file before starting.**

1. Copy the example file:
   ```sh
   cp .env.example .env
   ```
2. Edit `.env` and set `REACT_APP_API_BASE_URL` to the base URL of your backend API,
   for example:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```

### 3. Install Dependencies

```sh
npm install
```

### 4. Start the Development Server

```sh
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Connecting to the Backend

To ensure the frontend connects to your backend API (`workout_backend`):

- The variable `REACT_APP_API_BASE_URL` in your `.env` must point to the correct base (e.g., `http://localhost:5000/api/v1`).
- The backend server must have CORS enabled for `http://localhost:3000` (see backend docs).
- Full API integration expects endpoints for authentication, profile, workouts, levels, and progress (see backend contract).

---

## Important Environment Variables

| Variable                | Description                                 | Example Value                    |
|-------------------------|---------------------------------------------|----------------------------------|
| REACT_APP_API_BASE_URL  | URL for the backend API (must include /v1)  | http://localhost:5000/api/v1     |

See `.env.example` for format.

---

## Project Structure

```
main_frontend/
├── public/
├── src/
│   ├── api.js
│   ├── App.js
│   ├── ...
├── .env.example
└── README.md
```

---

## Customization

### Colors

FitFlex theme colors are defined as CSS variables in `src/App.css`, e.g.:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #282c34;
  --accent: #00C897;
}
```

---

## Learn More

- [React Documentation](https://reactjs.org/)
- [API Documentation](../workout_backend/README.md) *(See backend for endpoint contract)*

---
