# FocusFlow

FocusFlow is a full-stack task and focus management application built with React, Node.js (Express), and PostgreSQL.
The app helps users manage tasks and run focused work sessions, all served under a single production domain.

## Live Demo

Production URL (Render):
https://focusflow-dkg1.onrender.com

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT (Bearer tokens)
- Deployment: Render (single service – frontend + backend)

## Core Features

- User authentication (register / login)
- Task management (create, edit, complete, delete)
- Task priorities and due dates
- Focus mode – only one active focus session per user
- Focus history and daily focus statistics
- Secure, user-scoped data access

## Domain Entities

User:
- id
- email
- passwordHash
- createdAt

Task:
- id
- userId
- title
- description
- status (TODO / IN_PROGRESS / COMPLETED)
- priority
- dueDate
- createdAt
- updatedAt

FocusSession:
- id
- userId
- taskId
- startedAt
- endedAt

## Local Development

Prerequisites:
- Node.js 18+
- PostgreSQL

Clone the repository:
```bash
git clone https://github.com/AvivBichachi/focusflow.git
cd focusflow
```

Environment variables (server/.env):
```bash
DB_HOST=localhost
DB_PORT=5433
DB_NAME=focusflow
DB_USER=focusflow
DB_PASSWORD=admin

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Run backend:
```bash
cd server
npm install
node index.js
```

Backend runs on:
http://localhost:4000

Run frontend:
```bash
cd client
npm install
npm run dev
```

Frontend runs on:
http://localhost:5173

## Deployment

The application is deployed on Render as a single web service.
The React app is built into client/dist and served by Express.
API routes are mounted under /api/*.

This architecture simplifies authentication, deployment, and production configuration.
