# Login Authentication System

A full-stack login authentication application built with React, TypeScript, Node.js, Express, Prisma, and SQLite. The application provides secure user registration, login, JWT-based authentication, protected routes, and session management.

## Project Overview

This project demonstrates a complete user authentication workflow, including account creation, password validation, secure password hashing, token-based authentication, and protected user dashboards.

## Features

- User registration with input validation.
- User login with email and password.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected dashboard accessible only to authenticated users.
- Persistent authentication across page refreshes using session storage.
- Password visibility toggle.
- Password confirmation and strength validation.
- Duplicate email detection.
- User profile information.
- Logout functionality.
- Responsive user interface.
- Error handling and loading states.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite
- JSON Web Tokens (JWT)
- bcrypt
- Zod

## Project Structure

```text
Web-Development-Level-2-Login-Authentication/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   └── auth.routes.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── utils/
│   │   │   └── generateToken.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── prisma7.config.ts
│   └── package.json
│
├── screenshots/
└── README.md
```

## Installation and Setup

### Prerequisites

Install the following:

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/KhalidWayu/OIBSIP.git
```

Navigate to the project directory:

```bash
cd OIBSIP/Web-Development-Level-2-Login-Authentication
```

### 2. Set up the backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="your-generated-secret"
JWT_EXPIRES_IN="1d"
```

Generate a secure JWT secret and replace the placeholder. Never commit your real `.env` file.

Generate the Prisma Client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 3. Set up the frontend

Open another terminal and navigate to the client directory:

```bash
cd OIBSIP/Web-Development-Level-2-Login-Authentication/client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API and database status |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate an existing user |
| GET | `/api/auth/me` | Retrieve the authenticated user |

### Authentication

Protected endpoints require a JWT in the Authorization header:

```text
Authorization: Bearer <your-token>
```

## Security Features

- Passwords are hashed using bcrypt before storage.
- Authentication is handled using signed JWTs.
- Protected routes require valid authentication.
- Invalid and expired tokens are rejected.
- Passwords are never returned in user profile responses.
- Authentication tokens are stored in browser session storage.

## Testing

The following application scenarios were tested:

- Successful user registration.
- Successful login.
- Incorrect login credentials.
- Invalid email validation.
- Password length validation.
- Uppercase and number requirements.
- Password confirmation validation.
- Duplicate email registration.
- Password visibility toggles.
- Protected dashboard access.
- Automatic redirect for unauthenticated users.
- Session restoration after refreshing the dashboard.
- Logout functionality.

## Screenshots

Application screenshots will be added here.

| Page | Screenshot |
|---|---|
| Login | `screenshots/login.png` |
| Registration | `screenshots/register.png` |
| Dashboard | `screenshots/dashboard.png` |

## Author

**Khalid Wayu**

GitHub: [KhalidWayu](https://github.com/KhalidWayu)

LinkedIn: [khalid-wayu](https://www.linkedin.com/in/khalid-wayu/)

## Internship

Oasis Infobyte — Summer Internship Program (SIP)

Track: Web Development & Designing

Level: Level 2 — Intermediate

Project: Login Authentication System
