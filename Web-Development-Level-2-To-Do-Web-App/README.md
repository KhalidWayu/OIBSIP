# To-Do Web App

A full-stack To-Do Web Application that allows users to register, log in, and manage their personal tasks.

Users can create, edit, delete, search, filter, and track tasks through a responsive interface.

## Features

### Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected dashboard
- Persistent login using browser local storage

### Task Management
- Create, edit, and delete tasks
- Mark tasks as completed or pending
- Add task descriptions and due dates
- Search tasks by keyword
- Filter tasks by status
- Paginate task results
- Keep each user's tasks private

### Additional Features
- Responsive user interface
- API health-check endpoint
- SQLite database
- Prisma ORM


## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JSON Web Tokens (JWT)
- bcrypt
- Zod


## Project Structure

text
Web-Development-Level-2-To-Do-Web-App/
|
|-- client/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- types/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- index.css
|   |-- package.json
|
|-- server/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |-- src/
|   |   |-- generated/
|   |   |-- lib/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- server.ts
|   |-- .env
|   |-- dev.db
|   |-- package.json
|   |-- prisma7.config.ts
|
|-- README.md

## Requirements

Install the following before running the project:

- Node.js
- npm

## Installation and Setup

### 1. Clone the repository

bash
git clone YOUR_REPOSITORY_URL
cd Web-Development-Level-2-To-Do-Web-App
2. Set up the backend
Open a terminal in the project root:
cd server
npm install
3. Configure environment variables
Create a .env file inside the server directory:
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="replace_with_a_secure_random_secret"

### 4. Set up the database

The project uses SQLite and Prisma.

From the `server` directory, apply the existing database migrations:

```bash
npx prisma migrate deploy --config prisma7.config.ts


Generate the Prisma client:
npx prisma generate --config prisma7.config.ts


5. Start the backend
From the server directory, run:
npm run dev


The backend runs at:

http://localhost:5000

API health check:

http://localhost:5000/api/health


### 6. Set up the frontend

Open a second terminal in the project root:

bash
cd client
npm install
npm run dev


The frontend runs at:

http://localhost:5173

Open this address in your browser to use the application.

All task endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get tasks |
| GET | `/api/tasks/:id` | Get a specific task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

The task listing endpoint supports:

- `status`: all, completed, or pending
- `search`: search tasks by keyword
- `page`: pagination page number
- `limit`: number of tasks per page

Example:

text
GET /api/tasks?page=1&limit=10&status=pending


Health Check
Method	Endpoint	Description
GET	/	Check whether the API is running
GET	/api/health	Check API and database connectivity



## Available Scripts

### Backend

Run these commands inside the `server` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled server |

### Frontend

Run these commands inside the `client` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |



## Database Models

### User

- id
- name
- email
- password
- createdAt
- updatedAt

### Task

- id
- title
- description
- completed
- dueDate
- userId
- createdAt
- updatedAt

Each task belongs to a user. Deleting a user also deletes their associated tasks.

## Security

- Passwords are hashed using bcrypt.
- Protected routes require a valid JWT.
- Task operations are restricted to the authenticated user.
- Environment variables are used for database configuration and JWT secrets.
- Do not commit `.env` files or expose authentication secrets.

## Build Verification

### Backend

Open a terminal inside the `server` directory:

bash
npm run build


Frontend
Open a terminal inside the client directory:
npm run build


Both builds should complete without TypeScript or compilation errors.
Author
Developed as a Web Development Level 2 project.
