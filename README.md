# FocusFlow
FocusFlow is a full-stack task and focus management application built with React, Node.js, and PostgreSQL.

## MVP (v1)

### Scope
- Manage tasks (create, edit, complete, delete)
- Priorities and due dates
- Basic focus mode (single active focus task)

### Core entities
- **Task**: title, description, status, priority, dueDate, createdAt, updatedAt
- **FocusSession** (optional for v1): activeTaskId, startedAt, endedAt

## Getting Started

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```